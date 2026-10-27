import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';
import { useSeo } from '../lib/useSeo.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useSeo({ title: 'ثبت‌نام', description: 'ساخت حساب کاربری در فروشگاه لونورا.' });

  const setField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 8) {
      setError('گذرواژه باید دست‌کم ۸ کاراکتر باشد.');
      return;
    }
    setSubmitting(true);
    try {
      await register(form.fullName.trim(), form.email.trim(), form.password);
      navigate('/account', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shell flex justify-center pb-20 pt-12">
      <div className="w-full max-w-sm">
        <h1 className="h1">ساخت حساب کاربری</h1>
        <p className="lede mt-2">برای پیگیری آسان‌تر سفارش‌ها و ذخیره اطلاعات خرید.</p>

        <form onSubmit={submit} noValidate className="mt-7 space-y-4">
          <div>
            <label htmlFor="register-name" className="label">
              نام و نام خانوادگی
            </label>
            <input
              id="register-name"
              autoComplete="name"
              value={form.fullName}
              onChange={setField('fullName')}
              className="field"
              required
            />
          </div>
          <div>
            <label htmlFor="register-email" className="label">
              ایمیل
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={setField('email')}
              className="field ltr"
              required
            />
          </div>
          <div>
            <label htmlFor="register-password" className="label">
              گذرواژه
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={setField('password')}
              className="field ltr"
              required
              minLength={8}
            />
            <span className="hint">دست‌کم ۸ کاراکتر.</span>
          </div>

          {error ? (
            <p role="alert" className="rounded-soft border border-clay/30 bg-clay/5 px-3 py-2.5 text-[11.5px] text-clay">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={submitting} className="btn btn-primary w-full">
            {submitting ? 'در حال ثبت‌نام…' : 'ثبت‌نام'}
          </button>
        </form>

        <p className="mt-6 text-[12px] text-muted">
          حساب دارید؟{' '}
          <Link to="/login" className="text-ink underline underline-offset-4 hover:text-muted">
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
}
