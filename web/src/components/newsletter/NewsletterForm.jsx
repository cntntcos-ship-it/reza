import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function NewsletterForm({ variant = 'inline' }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const { notify } = useToast();
  const inputId = useId();
  const consentId = useId();
  const isDone = status === 'done';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const data = await api.subscribe({ email: email.trim(), consent });
      setStatus('done');
      setMessage(data.message || 'عضویت شما ثبت شد.');
      setEmail('');
      setConsent(false);
      notify(data.message || 'عضویت شما ثبت شد.', 'success');
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <form className={`newsletter-form newsletter-form--${variant}`} onSubmit={handleSubmit} noValidate>
      <label className="visually-hidden" htmlFor={inputId}>
        آدرس ایمیل
      </label>
      <div className="newsletter-form__row">
        <input
          id={inputId}
          className="input newsletter-form__input"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          placeholder="email@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === 'error') setStatus('idle');
          }}
          aria-invalid={status === 'error'}
          aria-describedby={`${inputId}-message`}
          required
        />
        <button type="submit" className="btn btn--dark newsletter-form__submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'در حال ثبت…' : 'عضویت در خبرنامه'}
        </button>
      </div>

      <label className="checkbox newsletter-form__consent" htmlFor={consentId}>
        <input
          id={consentId}
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>
          با دریافت ایمیل‌های لونورا موافقم و می‌توانم هر زمان لغو کنم.{" "}
          <Link to="/privacy" className="newsletter-form__policy">
            حریم خصوصی
          </Link>
        </span>
      </label>

      <p
        id={`${inputId}-message`}
        className={`newsletter-form__message ${status === 'error' ? 'is-error' : ''} ${isDone ? 'is-done' : ''}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
}
