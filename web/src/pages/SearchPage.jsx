import { useSearchParams } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext.jsx';
import { useSeo } from '../lib/seo.js';
import ListingView from '../components/product/ListingView.jsx';

const SIDEBAR_CATEGORIES = ['c-women', 'c-men', 'c-shoes', 'c-bags-accessories', 'c-sale'];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const term = (searchParams.get('q') || '').trim();
  const { categories } = useConfig();

  useSeo({
    title: term ? `جست‌وجو: ${term}` : 'جست‌وجو',
    description: 'نتایج جست‌وجو در محصولات لونورا.',
  });

  return (
    <ListingView
      breadcrumbs={[
        { name: 'خانه', to: '/' },
        { name: 'جست‌وجو', to: '/search' },
      ]}
      eyebrow="نتیجه جست‌وجو"
      title={term ? `«${term}»` : 'جست‌وجو در محصولات'}
      lead={term ? 'نتیجه‌های مطابق با عبارت شما؛ می‌توانید با فیلترها دقیق‌ترش کنید.' : 'عبارتی برای جست‌وجو وارد نشده است.'}
      filterCategories={categories.filter((category) => SIDEBAR_CATEGORIES.includes(category.id))}
      emptyTitle={term ? `چیزی برای «${term}» پیدا نشد` : 'عبارت جست‌وجو خالی است'}
      emptyText="املای عبارت را بررسی کنید یا با دسته‌بندی‌ها جست‌وجو را ادامه دهید."
    />
  );
}
