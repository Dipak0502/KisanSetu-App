import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  updateQuantity: (productId: number, quantity: number) => { success: boolean; message?: string };
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CART_STORAGE_KEY = 'kisansetu_cart_items';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Failed to save cart to localStorage', err);
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.quantity <= 0) {
      return { success: false, message: `"${product.name}" is currently out of stock.` };
    }

    const existing = items.find(i => i.product_id === product.product_id);
    const currentQty = existing ? existing.quantity : 0;
    const requestedTotal = currentQty + quantity;

    if (requestedTotal > product.quantity) {
      return {
        success: false,
        message: `Cannot add more than ${product.quantity} ${product.unit} (available stock limit reached).`
      };
    }

    setItems(prev => {
      const idx = prev.findIndex(i => i.product_id === product.product_id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: requestedTotal, product };
        return copy;
      }
      return [...prev, { product_id: product.product_id, product, quantity }];
    });

    return { success: true };
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    const item = items.find(i => i.product_id === productId);
    if (!item) return { success: false, message: 'Item not in cart' };

    if (quantity > item.product.quantity) {
      return {
        success: false,
        message: `Only ${item.product.quantity} ${item.product.unit} available in farmer stock.`
      };
    }

    setItems(prev => prev.map(i => i.product_id === productId ? { ...i, quantity } : i));
    return { success: true };
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(i => i.product_id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      totalCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
