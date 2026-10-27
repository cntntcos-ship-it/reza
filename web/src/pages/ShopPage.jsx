import { useConfig } from '../context/ConfigContext.jsx';
import { useSeo } from '../lib/seo.js';
import ListingView from '../components/product/ListingView.jsx';

const SIDEBAR_CATEGORIES = ['c-women', 'c-men', 'c-shoes', 'c-bags-accessories', 'c-sale'];

export default function ShopPage() {
  const { categories } = useConfig();

  useSeo({
    title: 'فروشگاه',
    description:
      'همه‌ی محصولات لونورا: پیراهن، بافت، کت و پالتو، کیف و کفش چرم و اکسسوری. فیلتر بر اساس دسته‌بندی، سایز، رنگ و قیمت.',
  });

  return (
    <ListingView
      breadcrumbs={[
        { name: 'خانه', to: '/' },
        { name: 'فروشگاه', to: '/shop' },
      ]}
      eyebrow="همه محصولات"
      title="فروشگاه لونورا"
      lead="از پوشاک روزمره تا منتخب‌های مجلسی؛ با فیلتر سایز، رنگ و قیمت انتخاب کن."
      filterCategories={categories.filter((category) => SIDEBAR_CATEGORIES.includes(category.id))}
      emptyTitle="محصولی با این فیلترها پیدا نشد"
      emptyText="یکی از فیلترها را بردارید یا همه‌ی محصولات را ببینید."
    />
  );
}
