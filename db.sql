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