import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';
import { useSeo } from '../lib/useSeo.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useSeo({ title: 'ورود به حساب', description: 'ورود به حساب کاربری فروشگاه لونورا.' });

  const next = searchParams.get('next') || '/account';

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate(next, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shell flex justify-center pb-20 pt-12">
      <div className="w-full max-w-sm">
        <h1 className="h1">ورود به حساب</h1>
        <p className="lede mt-2">برای دیدن سفارش‌ها و ادامه خرید وارد شوید.</p>

        <form onSubmit={submit} noValidate className="mt-7 space-y-4">
          <div>
            <label htmlFor="login-email" className="label">
              ایمیل
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field ltr"
              required
            />
          </div>
          <div>
            <label htmlFor="login-password" className="label">
              گذرواژه
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field ltr"
              required
            />
          </div>

          {error ? (
            <p role="alert" className="rounded-soft border border-clay/30 bg-clay/5 px-3 py-2.5 text-[11.5px] text-clay">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={submitting} className="btn btn-primary w-full">
            {submitting ? 'در حال ورود…' : 'ورود'}
          </button>
        </form>

        <p className="mt-6 text-[12px] text-muted">
          حساب ندارید؟{' '}
          <Link to="/register" className="text-ink underline underline-offset-4 hover:text-muted">
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
}
