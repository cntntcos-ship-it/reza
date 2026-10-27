import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from './toast.jsx';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'lunora_wishlist_v1';

const readWishlist = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * The saved list lives on the device (localStorage). It is available without an
 * account, survives reloads, and never claims to be a server-side profile list.
 */
export function WishlistProvider({ children }) {
  const [items, setItems] = useState(readWishlist);
  const { notify } = useToast();

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore unavailable storage */
    }
  }, [items]);

  const has = useCallback((productId) => items.some((item) => item.id === productId), [items]);

  const toggle = useCallback(
    (product) => {
      setItems((current) => {
        const exists = current.some((item) => item.id === product.id);
        if (exists) {
          notify('از علاقه‌مندی‌ها حذف شد.');
          return current.filter((item) => item.id !== product.id);
        }
        notify('به علاقه‌مندی‌ها اضافه شد.');
        return [
          ...current,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            compareAtPrice: product.compareAtPrice ?? null,
            image: product.images?.[0] ?? null,
            addedAt: new Date().toISOString(),
          },
        ];
      });
    },
    [notify],
  );

  const remove = useCallback(
    (productId) => {
      setItems((current) => current.filter((item) => item.id !== productId));
      notify('از علاقه‌مندی‌ها حذف شد.');
    },
    [notify],
  );

  const value = useMemo(
    () => ({ items, count: items.length, has, toggle, remove }),
    [items, has, toggle, remove],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider');
  return context;
}
