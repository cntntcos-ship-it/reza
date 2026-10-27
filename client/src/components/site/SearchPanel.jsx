import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { api } from '../../lib/api.js';
import { img } from '../../lib/img.js';
import { formatToman } from '../../lib/format.js';

export default function SearchPanel({ open, onClose }) {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    setTerm('');
    setResults([]);
    setStatus('idle');
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const trimmed = useMemo(() => term.trim(), [term]);

  useEffect(() => {
    if (!open) return undefined;
    if (trimmed.length < 2) {
      setResults([]);
      setStatus('idle');
      return undefined;
    }
    setStatus('loading');
    const timer = window.setTimeout(() => {
      api
        .get('/products', { q: trimmed, perPage: 6 })
        .then((data) => {
          setResults(data.items);
          setStatus('done');
        })
        .catch(() => setStatus('error'));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [trimmed, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-label="جست‌وجو">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default bg-ink/35 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="بستن جست‌وجو"
      />
      <div className="relative mx-auto mt-0 w-full max-w-3xl bg-canvas px-4 pb-8 pt-5 shadow-drawer md:mt-16 md:rounded-soft md:px-8">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (trimmed) {
              onClose();
              navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
            }
          }}
          className="flex items-center gap-3 border-b border-ink/15 pb-3"
        >
          <Search size={18} className="shrink-0 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="نام محصول، دسته‌بندی یا کلمه کلیدی…"
            aria-label="عبارت جست‌وجو"
            className="h-11 flex-1 border-0 bg-transparent text-sm text-ink placeholder:text-muted/80 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-ink"
            aria-label="بستن"
          >
            <X size={18} />
          </button>
        </form>

        <div className="pt-5">
          {trimmed.length < 2 ? (
            <p className="text-xs text-muted">
              برای دیدن نتایج، دست‌کم دو حرف از نام محصول را بنویسید.
            </p>
          ) : null}

          {status === 'loading' ? <p className="text-xs text-muted">در حال جست‌وجو…</p> : null}
          {status === 'error' ? (
            <p className="text-xs text-clay">جست‌وجو انجام نشد. لطفاً دوباره تلاش کنید.</p>
          ) : null}

          {status === 'done' && results.length === 0 ? (
            <p className="text-xs text-muted">محصولی با این عبارت پیدا نشد.</p>
          ) : null}

          {results.length > 0 ? (
            <ul className="divide-y divide-line">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-3 transition-colors hover:bg-white/60"
                  >
                    <img
                      src={img(product.images?.[0], 160)}
                      alt=""
                      width={56}
                      height={72}
                      loading="lazy"
                      className="h-[72px] w-14 rounded-soft object-cover"
                    />
                    <span className="flex-1">
                      <span className="block text-[13px] text-ink">{product.name}</span>
                      <span className="num mt-0.5 block text-xs text-muted">
                        {formatToman(product.price)} تومان
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          {results.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
              }}
              className="mt-4 text-[13px] text-ink underline underline-offset-4 hover:text-muted"
            >
              دیدن همه نتایج برای «{trimmed}»
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
