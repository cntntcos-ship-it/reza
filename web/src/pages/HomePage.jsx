import { useConfig } from '../context/ConfigContext.jsx';
import { useSeo } from '../lib/seo.js';
import HeroSection from '../components/home/HeroSection.jsx';
import CategoryCircleList from '../components/home/CategoryCircleList.jsx';
import FeaturedCategoryGrid from '../components/home/FeaturedCategoryGrid.jsx';
import PromotionalBanners from '../components/home/PromotionalBanners.jsx';
import BestSellers from '../components/home/BestSellers.jsx';
import BenefitsStrip from '../components/home/BenefitsStrip.jsx';
import NewsletterSection from '../components/home/NewsletterSection.jsx';

export default function HomePage() {
  const { circles, featuredCategories } = useConfig();

  useSeo({
    title: '',
    description:
      'لونورا؛ فروشگاه پوشاک و اکسسوری با طراحی مینیمال. کالکشن زنانه و مردانه، کیف و کفش چرم و اکسسوری‌های ساده — استایلی ماندگار، انتخابی برای تو.',
  });

  return (
    <>
      <HeroSection />
      <CategoryCircleList categories={circles} />
      <FeaturedCategoryGrid categories={featuredCategories} />
      <PromotionalBanners />
      <BestSellers />
      <BenefitsStrip />
      <NewsletterSection />
    </>
  );
}
