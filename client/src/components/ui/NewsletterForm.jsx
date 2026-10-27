import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { Check } from 'lucide-react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/**
 * Saves the address to the store's subscriber table. Email delivery is not
 * connected in this build, so the confirmation says so instead of implying a
 * message was sent.
 */
export default function NewsletterForm({ tone = 'light', compact = false, idPrefix = 'newsletter' }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const isDark = tone === 'dark';
  const id = `${idPrefix}-email`;

  const submit = async (event) => {
    event.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError('ایمیل وارد شده معتبر نیست.');
      return;
    }
    if (!consent) {
      setError('برای عضویت باید با دریافت ایمیل‌ها موافقت کنید.');
      return;
    }
    setError('');
    setStatus('loading');
    try {
      const data = await api.post('/newsletter', { email: email.trim(), consent: true });
      setStatus(data.alreadySubscribed ? 'already' : 'done');
      setEmail('');
      setConsent(false);
    } catch (requestError) {
      setStatus('idle');
      setError(requestError.message);
    }
  };

  if (status === 'done' || status === 'already') {
    return (
      <div
        className={`flex items-start gap-3 rounded-soft border px-4 py-4 text-sm ${
          isDark ? 'border-white/15 bg-white/5 text-white' : 'border-line bg-white text-ink'
        }`}
      >
        <Check size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium">
            {status === 'already' ? 'این ایمیل قبلاً ثبت شده است.' : 'عضویت شما ثبت شد.'}
          </p>
          <p className={`mt-1 text-xs ${isDark ? 'text-white/60' : 'text-muted'}`}>
            نشانی شما در فهرست خبرنامه ذخیره شد. ارسال خودکار ایمیل در این نسخه پیکربندی نشده
            است.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className={compact ? 'flex flex-col gap-2.5' : 'flex flex-col gap-3 sm:flex-row'}>
        <label htmlFor={id} className="sr-only">
          ایمیل
        </label>
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError('');
          }}
          placeholder="ایمیل خود را وارد کنید"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`field flex-1 ${isDark ? 'border-white/20 bg-white/10 text-white placeholder:text-white/45' : ''} ${
            error ? 'field-error' : ''
          }`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`btn shrink-0 ${isDark ? 'bg-white text-ink hover:bg-cream' : 'btn-primary'}`}
        >
          {status === 'loading' ? 'در حال ثبت…' : 'عضویت در خبرنامه'}
        </button>
      </div>

      <label
        className={`mt-3 flex items-start gap-2 text-[11px] leading-5 ${
          isDark ? 'text-white/60' : 'text-muted'
        }`}
      >
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => {
            setConsent(event.target.checked);
            setError('');
          }}
          className="mt-0.5 h-4 w-4 shrink-0 accent-ink"
        />
        <span>
          با دریافت ایمیل‌های خبرنامه موافقم و{' '}
          <Link to="/privacy" className="underline underline-offset-4 hover:no-underline">
            سیاست حفظ حریم خصوصی
          </Link>{' '}
          را می‌پذیرم.
        </span>
      </label>

      {error ? (
        <p id={`${id}-error`} role="alert" className="error-text">
          {error}
        </p>
      ) : null}
    </form>
  );
}
