import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useUi } from '../../context/UiContext.jsx';
import { useConfig } from '../../context/ConfigContext.jsx';
import { formatToman } from '../../lib/format.js';
import { IconClose, IconSearch } from '../ui/Icons.jsx';

export default function SearchPanel() {
  const { searchOpen, closeSearch } = useUi();
  const { circles } = useConfig();
  const navigate = useNavigate();
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!searchOpen) return;
    setTerm('');
    setResults([]);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const trimmed = term.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const data = await api.suggest(trimmed);
        setResults(data.items ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 260);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [term, searchOpen]);

  if (!searchOpen) return null;

  const goTo = (path) => {
    closeSearch();
    navigate(path);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = term.trim();
    if (!trimmed) return;
    goTo(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <div className="backdrop" onClick={closeSearch} aria-hidden="true" />
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="جست‌وجوی محصولات">
        <div className="container search-panel__inner">
          <div className="search-panel__head">
            <form className="search-panel__form" onSubmit={handleSubmit} role="search">
              <IconSearch width={22} height={22} aria-hidden="true" />
              <label className="visually-hidden" htmlFor="site-search">
                جست‌وجو در محصولات
              </label>
              <input
                id="site-search"
                ref={inputRef}
                className="search-panel__input"
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="نام محصول، دسته‌بندی یا کلمه‌ی کلیدی…"
                autoComplete="off"
              />
            </form>
            <button type="button" className="icon-btn" onClick={closeSearch} aria-label="بستن جست‌وجو">
              <IconClose />
            </button>
          </div>

          <div className="search-panel__body">
            {term.trim().length >= 2 ? (
              loading && results.length === 0 ? (
                <p className="search-panel__hint">در حال جست‌وجو…</p>
              ) : results.length > 0 ? (
                <ul className="search-results">
                  {results.map((item) => (
                    <li key={item.id}>
                      <button type="button" className="search-result" onClick={() => goTo(`/product/${item.slug}`)}>
                        <img src={item.image} alt="" width={56} height={70} loading="lazy" />
                        <span className="search-result__text">
                          <span className="search-result__name">{item.name}</span>
                          <span className="search-result__meta">
                            {item.category} · {formatToman(item.price)}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button type="button" className="search-panel__all" onClick={() => goTo(`/search?q=${encodeURIComponent(term.trim())}`)}>
                      دیدن همه‌ی نتایج برای «{term.trim()}»
                    </button>
                  </li>
                </ul>
              ) : (
                <p className="search-panel__hint">چیزی برای «{term.trim()}» پیدا نشد. عبارت کوتاه‌تری امتحان کنید.</p>
              )
            ) : (
              <div className="search-panel__suggestions">
                <p className="search-panel__label">دسته‌بندی‌های پرطرفدار</p>
                <ul className="search-panel__chips">
                  {circles.map((category) => (
                    <li key={category.id}>
                      <button type="button" className="chip" onClick={() => goTo(`/category/${category.slug}`)}>
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
