import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'lunora_cart_v1';

const readCart = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const lineKey = (productId, size, color) => `${productId}::${size}::${color}`;

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage can be unavailable in private mode — the cart then lives for this session only */
    }
  }, [items]);

  const add = useCallback((product, { size, color, quantity = 1 }) => {
    const key = lineKey(product.id, size ?? '', color ?? '');
    setItems((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        const stockLimit = Math.min(product.stock, 10);
        return current.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(item.quantity + quantity, stockLimit) }
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
          image: product.images?.[0] ?? null,
          price: product.price,
          compareAtPrice: product.compareAtPrice ?? null,
          size: size ?? '',
          color: color ?? '',
          quantity,
          stock: product.stock,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    setItems((current) =>
      current.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.min(Math.max(quantity, 1), Math.min(item.stock, 10)) }
          : item,
      ),
    );
  }, []);

  const remove = useCallback((key) => {
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      add,
      updateQuantity,
      remove,
      clear,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [items, count, subtotal, add, updateQuantity, remove, clear, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
