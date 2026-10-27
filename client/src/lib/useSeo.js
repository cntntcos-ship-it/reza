import { useEffect } from 'react';

const BRAND = 'لونورا';

export function useSeo({ title, description }) {
  useEffect(() => {
    if (title) document.title = `${title} | ${BRAND}`;
    if (description) {
      const tag = document.querySelector('meta[name="description"]');
      if (tag) tag.setAttribute('content', description);
    }
  }, [title, description]);
}

/** Adds page structured data; removed when the page unmounts. */
export function useJsonLd(data) {
  useEffect(() => {
    if (!data) return undefined;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    script.dataset.pageStructuredData = 'true';
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [data]);
}
