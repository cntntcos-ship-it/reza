import { useEffect, useState } from 'react';
import { api } from './api.js';

let cached = null;
let pending = null;

export function useCategories() {
  const [categories, setCategories] = useState(cached ?? []);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cached) return;
    let active = true;
    pending = pending ?? api.get('/categories');
    pending
      .then((data) => {
        cached = data.categories;
        if (active) setCategories(data.categories);
      })
      .catch((requestError) => {
        pending = null;
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, []);

  return { categories, error };
}
