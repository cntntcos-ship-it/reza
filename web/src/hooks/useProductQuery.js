import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';

export const SORT_OPTIONS = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
];

export const PAGE_SIZE = 9;

const splitList = (value) => (value ? value.split(',').filter(Boolean) : []);

/**
 * Reads the listing state from the URL (so every filter combination is
 * shareable), fetches matching products and exposes helpers to change it.
 */
export function useProductQuery({ fixedCategory = '', limit = PAGE_SIZE } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      category: fixedCategory || searchParams.get('category') || '',
      q: searchParams.get('q') || '',
      sort: searchParams.get('sort') || 'newest',
      sizes: splitList(searchParams.get('sizes')),
      colors: splitList(searchParams.get('colors')),
      min: searchParams.get('min') || '',
      max: searchParams.get('max') || '',
      page: Math.max(Number(searchParams.get('page')) || 1, 1),
    }),
    [searchParams, fixedCategory],
  );

  const [state, setState] = useState({
    items: [],
    total: 0,
    facets: null,
    hasMore: false,
    loading: true,
    error: '',
  });

  const update = useCallback(
    (patch, { resetPage = true } = {}) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([key, value]) => {
        const serialized = Array.isArray(value) ? value.join(',') : value;
        const isEmpty = serialized === '' || serialized === null || serialized === undefined;
        const isDefault = key === 'sort' && serialized === 'newest';
        if (isEmpty || isDefault) next.delete(key);
        else next.set(key, serialized);
      });
      if (resetPage) next.delete('page');
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const reset = useCallback(() => {
    const next = new URLSearchParams();
    if (filters.q) next.set('q', filters.q);
    setSearchParams(next, { replace: true });
  }, [filters.q, setSearchParams]);

  const toggleListValue = useCallback(
    (key, value) => {
      const current = filters[key];
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      update({ [key]: next });
    },
    [filters, update],
  );

  const requestId = useRef(0);

  // Only the latest request is allowed to write state, so a slow response for
  // an older filter set can never overwrite a newer one.
  const load = useCallback(async () => {
    const id = ++requestId.current;
    setState((previous) => ({ ...previous, loading: true, error: '' }));

    try {
      const data = await api.products({
        category: filters.category,
        q: filters.q,
        sort: filters.sort,
        sizes: filters.sizes,
        colors: filters.colors,
        min: filters.min,
        max: filters.max,
        page: filters.page,
        limit,
      });
      if (id !== requestId.current) return;
      setState({
        items: data.items ?? [],
        total: data.total ?? 0,
        facets: data.facets ?? null,
        hasMore: !!data.hasMore,
        loading: false,
        error: '',
      });
    } catch (error) {
      if (id !== requestId.current) return;
      setState((previous) => ({ ...previous, loading: false, error: error.message }));
    }
  }, [filters, limit]);

  useEffect(() => {
    load();
  }, [load]);

  const activeCount =
    filters.sizes.length +
    filters.colors.length +
    (filters.min ? 1 : 0) +
    (filters.max ? 1 : 0) +
    (filters.category && !fixedCategory ? 1 : 0);

  const totalPages = state.total ? Math.ceil(state.total / limit) : 1;

  return {
    filters,
    state,
    totalPages,
    activeCount,
    update,
    reset,
    toggleListValue,
    refetch: load,
  };
}
