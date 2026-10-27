// Central store settings that are *not* product data.
// Payment and email delivery are intentionally NOT configured — the UI states this.
export const shippingMethods = [
  { id: 'standard', title: 'ارسال عادی', description: '۲ تا ۴ روز کاری', cost: 49000 },
  { id: 'express', title: 'ارسال سریع', description: '۱ روز کاری (تهران و مراکز استان)', cost: 89000 },
];

export const maxQuantityPerItem = 5;
export const productsPerPage = 12;

export const orderStatusLabels = {
  awaiting_payment: 'در انتظار پرداخت',
  pending: 'ثبت شده، در انتظار بررسی',
  processing: 'در حال آماده‌سازی',
  shipped: 'ارسال شده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
};

export const paymentStatusLabels = {
  unpaid: 'پرداخت نشده',
  paid: 'پرداخت شده',
};
