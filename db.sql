CREATE TABLE public.distributor_products (
  distributor_id uuid NOT NULL,
  product_id uuid NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  CONSTRAINT distributor_products_pkey PRIMARY KEY (distributor_id, product_id),
  CONSTRAINT distributor_products_distributor_id_fkey FOREIGN KEY (distributor_id) REFERENCES public.distributors(id),
  CONSTRAINT distributor_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
alter policy "Lo stock è visibile a tutti."
on "public"."distributor_products"
to public
using (true);
CREATE TABLE public.distributors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT distributors_pkey PRIMARY KEY (id)
);
alter policy "I distributori sono visibili a tutti."
on "public"."distributors"
to public using (true);

CREATE TABLE public.offers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  type text NOT NULL,
  code text,
  expiry_info text,
  CONSTRAINT offers_pkey PRIMARY KEY (id)
);

alter policy "Le offerte sono visibili a tutti."
on "public"."offers" to public using (true);

CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid,
  product_id uuid,
  quantity integer NOT NULL,
  price_at_purchase numeric NOT NULL,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);

alter policy "Gli utenti possono vedere i dettagli dei propri ordini."
on "public"."order_items"
to public using ((( SELECT orders.user_id
   FROM orders
  WHERE (orders.id = order_items.order_id)) = auth.uid()));

CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  distributor_id uuid,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'Completato'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT orders_distributor_id_fkey FOREIGN KEY (distributor_id) REFERENCES public.distributors(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  price numeric NOT NULL,
  category text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);

alter policy "I prodotti sono visibili a tutti."
on "public"."products" to public using (true);

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  avatar_url text,
  diet_preference text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

alter policy "Gli utenti possono aggiornare il proprio profilo."
on "public"."profiles"
to public
using ((auth.uid = id));

alter policy "Gli utenti possono inserire il proprio profilo."
on "public"."profiles"
to public
with check ((auth.uid() = id));

alter policy "Gli utenti possono leggere il proprio profilo."
on "public"."profiles"
to public using ((auth.uid() = id));

CREATE TABLE public.recipes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  is_vegetarian boolean DEFAULT false,
  time_minutes integer,
  difficulty text,
  steps JSONB,
  CONSTRAINT recipes_pkey PRIMARY KEY (id)
);

alter policy "Le ricette sono visibili a tutti."
on "public"."recipes" to public using (true);

CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  distributor_id uuid,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_distributor_id_fkey FOREIGN KEY (distributor_id) REFERENCES public.distributors(id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

alter policy "Gli utenti possono inserire recensioni."
on "public"."reviews" to public with check ((auth.uid() = user_id));

alter policy "Le recensioni sono visibili a tutti."
on "public"."reviews" to public using (true);
CREATE OR REPLACE FUNCTION public.place_order(
    distributor_id_param UUID,
    cart_items JSONB
)
RETURNS UUID AS $$
DECLARE
    -- Variabili
    total_price_calc NUMERIC := 0;
    product_record RECORD;
    cart_item JSONB;
    new_order_id UUID;
    current_stock INT;
BEGIN
    -- Step 1: Itera sul carrello per validare lo stock e calcolare il prezzo
    FOR cart_item IN SELECT * FROM jsonb_array_elements(cart_items)
    LOOP
        -- Trova il prodotto nel DB per ottenere il prezzo reale
        SELECT * INTO product_record FROM public.products WHERE id = (cart_item->>'product_id')::UUID;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Prodotto con ID % non trovato.', cart_item->>'product_id';
        END IF;

        -- Controlla lo stock bloccando la riga per la transazione
        SELECT stock INTO current_stock
        FROM public.distributor_products
        WHERE product_id = product_record.id AND distributor_id = distributor_id_param
        FOR UPDATE;

        IF current_stock IS NULL OR current_stock < (cart_item->>'quantity')::INT THEN
            RAISE EXCEPTION 'Stock non sufficiente per il prodotto %. Disponibili: %, Richiesti: %', product_record.name, current_stock, cart_item->>'quantity';
        END IF;

        -- Calcola il totale parziale
        total_price_calc := total_price_calc + (product_record.price * (cart_item->>'quantity')::INT);
    END LOOP;

    -- Step 2: Se tutti i controlli sono passati, inserisci l'ordine
    INSERT INTO public.orders (user_id, distributor_id, total_price)
    VALUES (auth.uid(), distributor_id_param, total_price_calc)
    RETURNING id INTO new_order_id;

    -- Step 3: Itera di nuovo per aggiornare lo stock e inserire gli order_items
    FOR cart_item IN SELECT * FROM jsonb_array_elements(cart_items)
    LOOP
        -- Aggiorna lo stock
        UPDATE public.distributor_products
        SET stock = stock - (cart_item->>'quantity')::INT
        WHERE product_id = (cart_item->>'product_id')::UUID AND distributor_id = distributor_id_param;

        -- Inserisci l'item nell'ordine
        -- (Recuperiamo di nuovo il prezzo per sicurezza, anche se già calcolato)
        SELECT price INTO product_record.price FROM public.products WHERE id = (cart_item->>'product_id')::UUID;
        INSERT INTO public.order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES (new_order_id, (cart_item->>'product_id')::UUID, (cart_item->>'quantity')::INT, product_record.price);
    END LOOP;

    -- Step 4: Restituisci l'ID del nuovo ordine
    RETURN new_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
