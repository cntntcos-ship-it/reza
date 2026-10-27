import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

const ConfigContext = createContext(null);

// Only used as a last-resort fallback; the shell renders a boot screen until
// the real configuration arrives.
const FALLBACK_CONFIG = {
  brand: { nameFa: 'لونورا', nameLat: 'LUNORA', tagline: 'استایلی ماندگار، انتخابی برای تو', description: '' },
  currency: { code: 'IRT', label: 'تومان' },
  freeShippingThreshold: 5000000,
  shippingMethods: [],
  payments: { cashOnDelivery: true, onlineGateway: false, note: '' },
  newsletter: { provider: null, note: '' },
  social: [],
  demoCatalogue: true,
};

export function ConfigProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', config: null, categories: [], message: '' });

  const load = useCallback(async () => {
    setState((previous) => ({ ...previous, status: 'loading', message: '' }));
    try {
      const data = await api.bootstrap();
      setState({ status: 'ready', config: data.config, categories: data.categories ?? [], message: '' });
    } catch (error) {
      setState({ status: 'error', config: null, categories: [], message: error.message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(() => {
    const categories = state.categories;
    return {
      status: state.status,
      message: state.message,
      config: state.config ?? FALLBACK_CONFIG,
      categories,
      circles: categories
        .filter((category) => category.inCircles)
        .sort((a, b) => a.circleOrder - b.circleOrder),
      featuredCategories: categories.filter((category) => category.inFeaturedGrid),
      reload: load,
    };
  }, [state, load]);

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within ConfigProvider');
  return context;
}

/** Convenience hook for components that only need site settings. */
export function useSiteConfig() {
  return useConfig().config;
}
