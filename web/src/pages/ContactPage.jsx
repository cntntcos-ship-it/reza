import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useSeo } from '../lib/seo.js';
import Breadcrumbs from '../components/layout/Breadcrumbs.jsx';

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');

  useSeo({
    title: 'تماس با ما',
    description: 'پرسش، پیشنهاد یا درخواست پشتیبانی خود را برای تیم لونورا بفرستید.',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setFeedback('');

    try {
      const data = await api.contact(form);
      setStatus('done');
      setFeedback(data.message || 'پیام شما ثبت شد.');
      setForm(initialForm);
    } catch (error) {
      setStatus('error');
      setFeedback(error.message);
    }
  };

  return (
    <div className="page">
      <div className="container container--narrow">
        <Breadcrumbs
          items={[
            { name: 'خانه', to: '/' },
            { name: 'تماس با ما', to: '/contact' },
          ]}
        />

        <header className="page__head">
          <p className="eyebrow">پشتیبانی</p>
          <h1 className="page__title">تماس با ما</h1>
          <p className="page__lead">
            پرسش درباره‌ی سفارش، سایز، ارسال یا همکاری؟ فرم زیر را پر کنید؛ پیام شما در فروشگاه ثبت می‌شود.
          </p>
        </header>

        <div className="contact-layout">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="field">
                <label className="field__label" htmlFor="contact-name">
                  نام و نام خانوادگی
                </label>
                <input
                  id="contact-name"
                  className="input"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="field">
                <label className="field__label" htmlFor="contact-email">
                  ایمیل
                </label>
                <input
                  id="contact-email"
                  className="input"
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="field form-grid__full">
                <label className="field__label" htmlFor="contact-subject">
                  موضوع (اختیاری)
                </label>
                <input
                  id="contact-subject"
                  className="input"
                  value={form.subject}
                  onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                />
              </div>

              <div className="field form-grid__full">
                <label className="field__label" htmlFor="contact-message">
                  متن پیام
                </label>
                <textarea
                  id="contact-message"
                  className="textarea"
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  required
                />
              </div>
            </div>

            <p className={`form-feedback ${status === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">
              {feedback}
            </p>

            <button type="submit" className="btn btn--dark" disabled={status === 'loading'}>
              {status === 'loading' ? 'در حال ارسال…' : 'ارسال پیام'}
            </button>
          </form>

          <aside className="contact-aside">
            <h2 className="contact-aside__title">پیش از ارسال پیام</h2>
            <p>
              برای پرسش‌های پرتکرار درباره‌ی ارسال، بازگشت کالا و سایزبندی، صفحه‌ی{' '}
              <Link to="/faq">سؤالات متداول</Link> را ببینید.
            </p>
            <p>
              اگر سفارش ثبت کرده‌اید، کد پیگیری را همراه پیام بنویسید تا سریع‌تر بررسی شود. وضعیت سفارش را می‌توانید
              در صفحه‌ی <Link to="/account">پیگیری سفارش</Link> ببینید.
            </p>
            <p className="contact-aside__note">
              این فرم پیام را در فروشگاه ذخیره می‌کند؛ اتصال به سرویس ارسال ایمیل هنوز تنظیم نشده و پاسخ‌گویی از
              طریق همین فروشگاه انجام می‌شود.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
