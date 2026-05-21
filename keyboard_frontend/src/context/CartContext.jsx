import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '../services/cartService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCart = useCallback(async () => {
    if (!token) {
      setItems([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await cartService.fetchCart();
      setItems(response.data.items ?? []);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError(err.response?.data?.message || 'Failed to load cart');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (productId, quantity = 1) => {
    setActionLoading(true);
    setError(null);

    try {
      await cartService.addToCart(productId, quantity);
      await loadCart();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add item to cart';
      setError(message);
      throw message;
    } finally {
      setActionLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    setActionLoading(true);
    setError(null);

    try {
      await cartService.removeFromCart(cartItemId);
      await loadCart();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to remove item';
      setError(message);
      throw message;
    } finally {
      setActionLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    setActionLoading(true);
    setError(null);

    try {
      await cartService.updateCartItemQuantity(cartItemId, quantity);
      await loadCart();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update quantity';
      setError(message);
      throw message;
    } finally {
      setActionLoading(false);
    }
  };

  const clearCart = async () => {
    setActionLoading(true);
    setError(null);

    try {
      await cartService.clearCart();
      setItems([]);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to clear cart';
      setError(message);
      throw message;
    } finally {
      setActionLoading(false);
    }
  };

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((total, item) => {
        const price = parseFloat(item.product?.price ?? 0);
        return total + price * item.quantity;
      }, 0),
    [items]
  );

  const value = {
    items,
    loading,
    actionLoading,
    error,
    itemCount,
    subtotal,
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
