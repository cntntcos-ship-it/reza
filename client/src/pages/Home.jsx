import Hero from '../components/home/Hero.jsx';
import CategoryCircles from '../components/home/CategoryCircles.jsx';
import CategoryShowcase from '../components/home/CategoryShowcase.jsx';
import PromoBanners from '../components/home/PromoBanners.jsx';
import BestSellers from '../components/home/BestSellers.jsx';
import BenefitBar from '../components/home/BenefitBar.jsx';
import NewsletterSection from '../components/home/NewsletterSection.jsx';
import { useCategories } from '../lib/useCategories.js';
import { useSeo } from '../lib/useSeo.js';

export default function Home() {
  const { categories } = useCategories();
  useSeo({
    title: 'فروشگاه پوشاک لوکس',
    description:
      'لونورا؛ کالکشن پوشاک زنانه و مردانه با طراحی مینیمال، پارچه‌های طبیعی و رنگ‌های هماهنگ.',
  });

  return (
    <>
      <Hero />
      <CategoryCircles categories={categories} />
      <CategoryShowcase categories={categories} />
      <PromoBanners />
      <BestSellers />
      <BenefitBar />
      <NewsletterSection />
    </>
  );
}
