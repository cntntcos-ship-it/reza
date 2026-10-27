import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Remembers the control that opened an overlay so focus can return to it.
  const lastTrigger = useRef(null);

  const rememberTrigger = useCallback((element) => {
    lastTrigger.current = element ?? document.activeElement;
  }, []);

  const restoreFocus = useCallback(() => {
    const element = lastTrigger.current;
    if (element && typeof element.focus === 'function') {
      window.setTimeout(() => element.focus(), 0);
    }
  }, []);

  const openCart = useCallback(
    (trigger) => {
      rememberTrigger(trigger);
      setCartOpen(true);
    },
    [rememberTrigger],
  );

  const closeCart = useCallback(() => {
    setCartOpen(false);
    restoreFocus();
  }, [restoreFocus]);

  const openSearch = useCallback(
    (trigger) => {
      rememberTrigger(trigger);
      setSearchOpen(true);
    },
    [rememberTrigger],
  );

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    restoreFocus();
  }, [restoreFocus]);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const overlayOpen = cartOpen || searchOpen || menuOpen;

  useEffect(() => {
    if (!overlayOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [overlayOpen]);

  useEffect(() => {
    if (!overlayOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (cartOpen) closeCart();
        else if (searchOpen) closeSearch();
        else if (menuOpen) closeMenu();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [overlayOpen, cartOpen, searchOpen, menuOpen, closeCart, closeSearch, closeMenu]);

  const value = useMemo(
    () => ({
      cartOpen,
      openCart,
      closeCart,
      searchOpen,
      openSearch,
      closeSearch,
      menuOpen,
      openMenu,
      closeMenu,
    }),
    [cartOpen, openCart, closeCart, searchOpen, openSearch, closeSearch, menuOpen, openMenu, closeMenu],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const context = useContext(UiContext);
  if (!context) throw new Error('useUi must be used within UiProvider');
  return context;
}
