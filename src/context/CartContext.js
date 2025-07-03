import React, { createContext, useState, useContext, useMemo } from 'react';

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]); // Array di {product, quantity}
    const [distributor, setDistributor] = useState(null);

    const addItemsToCart = (items, distributorInfo) => {
        const itemsToAdd = items.filter(item => item.quantity > 0);

        // Se il carrello è vuoto o il distributore è diverso, sostituisci il carrello.
        if (!distributor || distributor.id !== distributorInfo.id) {
            setCartItems(itemsToAdd);
            setDistributor(distributorInfo);
        } else {
            // Altrimenti, unisci gli articoli.
            const newCartItems = [...cartItems];
            itemsToAdd.forEach(itemToAdd => {
                const existingItemIndex = newCartItems.findIndex(item => item.product.id === itemToAdd.product.id);

                if (existingItemIndex > -1) {
                    const existingItem = newCartItems[existingItemIndex];
                    const newQuantity = existingItem.quantity + itemToAdd.quantity;
                    // Assicurati di non superare lo stock disponibile
                    existingItem.quantity = Math.min(newQuantity, itemToAdd.product.stock);
                } else {
                    newCartItems.push(itemToAdd);
                }
            });
            setCartItems(newCartItems);
        }
    };
    
    const removeItemFromCart = (productId) => {
        const newCartItems = cartItems.filter(item => item.product.id !== productId);
        setCartItems(newCartItems);
        // Se il carrello diventa vuoto, resetta anche il distributore
        if (newCartItems.length === 0) {
            setDistributor(null);
        }
    };

    const updateItemQuantity = (productId, newQuantity) => {
        // Se la quantità è 0 o meno, rimuovi l'articolo
        if (newQuantity <= 0) {
            removeItemFromCart(productId);
            return;
        }

        const newCartItems = cartItems.map(item => {
            if (item.product.id === productId) {
                // Non permettere di superare lo stock disponibile
                const updatedQuantity = Math.min(newQuantity, item.product.stock || newQuantity);
                return { ...item, quantity: updatedQuantity };
            }
            return item;
        });
        setCartItems(newCartItems);
    };

    const clearCart = () => {
        setCartItems([]);
        setDistributor(null);
    };

    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => {
            return total + (parseFloat(item.product.price) * item.quantity);
        }, 0);
    }, [cartItems]);

    const value = {
        cartItems,
        distributor,
        addItemsToCart,
        updateItemQuantity, // <-- NUOVA FUNZIONE
        clearCart,
        totalPrice,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};