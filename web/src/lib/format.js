const numberFormatter = new Intl.NumberFormat('fa-IR');
const dateFormatter = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' });

export const formatNumber = (value) => numberFormatter.format(Number(value) || 0);

export const formatToman = (value) => `${numberFormatter.format(Number(value) || 0)} تومان`;

export const formatDate = (isoDate) => {
  if (!isoDate) return '';
  try {
    return dateFormatter.format(new Date(isoDate));
  } catch {
    return '';
  }
};

const ORDER_STATUS_LABELS = {
  registered: 'ثبت شده',
  processing: 'در حال آماده‌سازی',
  shipped: 'ارسال شده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
};

export const orderStatusLabel = (status) => ORDER_STATUS_LABELS[status] ?? status;

export const PAYMENT_STATUS_LABELS = {
  unpaid: 'پرداخت در محل (پرداخت‌نشده)',
  paid: 'پرداخت شده',
  refunded: 'بازپرداخت شده',
};

export const paymentStatusLabel = (status) => PAYMENT_STATUS_LABELS[status] ?? status;

export const discountLabel = (percent) => `${formatNumber(percent)}٪`;
