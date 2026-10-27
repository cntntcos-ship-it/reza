import { IconReturn, IconShield, IconSupport, IconTruck } from '../ui/Icons.jsx';

const BENEFITS = [
  { id: 'shipping', icon: IconTruck, title: 'ارسال سفارش', text: 'به سراسر ایران، با پست پیشتاز یا پیک' },
  { id: 'returns', icon: IconReturn, title: 'بازگشت کالا', text: 'طبق شرایط بازگشت فروشگاه' },
  { id: 'payment', icon: IconShield, title: 'پرداخت در محل', text: 'هنگام تحویل سفارش' },
  { id: 'support', icon: IconSupport, title: 'پشتیبانی مشتریان', text: 'از طریق فرم تماس و ایمیل' },
];

export default function BenefitsStrip() {
  return (
    <section className="benefits" aria-label="مزیت‌های خرید از لونورا">
      <div className="container">
        <ul className="benefits__list">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <li className="benefits__item" key={benefit.id}>
                <Icon width={26} height={26} aria-hidden="true" />
                <span className="benefits__text">
                  <span className="benefits__title">{benefit.title}</span>
                  <span className="benefits__desc">{benefit.desc ?? benefit.text}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
