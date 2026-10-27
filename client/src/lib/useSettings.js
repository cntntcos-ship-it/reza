import { useEffect, useState } from 'react';
import { api } from './api.js';

let cached = null;
let pending = null;

export function useSettings() {
  const [settings, setSettings] = useState(cached);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cached) return;
    let active = true;
    pending = pending ?? api.get('/settings');
    pending
      .then((data) => {
        cached = data;
        if (active) setSettings(data);
      })
      .catch((requestError) => {
        pending = null;
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, []);

  return { settings, error };
}
