import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'lunora.cart.v1';
const MAX_PER_LINE = 10;

function readStoredCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && item.productId && Number(item.quantity) > 0);
  } catch {
    return [];
  }
}

const lineKey = (productId, size, color) => `${productId}|${size}|${color}`;

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or disabled — the cart still works for this session */
    }
  }, [items]);

  const addItem = useCallback((product, { size, color, quantity = 1 } = {}) => {
    const maxStock = Math.max(Number(product.stock) || 0, 0);
    const limit = Math.min(maxStock || MAX_PER_LINE, MAX_PER_LINE);
    const key = lineKey(product.id, size, color);

    setItems((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(item.quantity + quantity, limit), maxStock: maxStock || item.maxStock }
            : item,
        );
      }
      return [
        ...current,
        {
          key,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.primaryImage ?? product.images?.[0] ?? '',
          price: product.finalPrice ?? product.salePrice ?? product.price,
          size,
          color,
          quantity: Math.min(quantity, limit),
          maxStock: maxStock || MAX_PER_LINE,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    setItems((current) =>
      current.map((item) => {
        if (item.key !== key) return item;
        const ceiling = Math.min(item.maxStock || MAX_PER_LINE, MAX_PER_LINE);
        const next = Math.min(Math.max(Number(quantity) || 1, 1), ceiling);
        return { ...item, quantity: next };
      }),
    );
  }, []);

  const removeItem = useCallback((key) => {
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { items, count, subtotal, addItem, updateQuantity, removeItem, clearCart };
  }, [items, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
