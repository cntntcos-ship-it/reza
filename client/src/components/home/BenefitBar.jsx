import { Link } from 'react-router-dom';
import { Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const items = [
  {
    icon: Truck,
    title: 'ارسال سفارش‌ها',
    description: 'شرایط ارسال را مشاهده کنید',
    to: '/shipping-returns',
  },
  {
    icon: RotateCcw,
    title: 'امکان بازگشت کالا',
    description: 'مطابق قوانین فروشگاه',
    to: '/shipping-returns',
  },
  {
    icon: ShieldCheck,
    title: 'پرداخت امن',
    description: 'درگاه پرداخت هنوز متصل نشده است',
    to: '/faq',
  },
  {
    icon: Headphones,
    title: 'پشتیبانی مشتریان',
    description: 'راه‌های ارتباط با ما',
    to: '/contact',
  },
];

export default function BenefitBar() {
  return (
    <section aria-label="مزایای خرید" className="pb-12 md:pb-16">
      <div className="shell">
        <div className="grid grid-cols-2 gap-y-8 rounded-soft bg-cream px-5 py-8 md:grid-cols-4 md:gap-6 md:px-8 md:py-9">
          {items.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="group flex flex-col items-center gap-2.5 text-center md:flex-row md:items-start md:gap-3.5 md:text-start"
            >
              <item.icon size={20} className="shrink-0 text-ink/70" aria-hidden="true" />
              <span>
                <span className="block text-[12.5px] font-medium text-ink">{item.title}</span>
                <span className="mt-1 block text-[11px] leading-5 text-muted">
                  {item.description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
