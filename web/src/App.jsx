import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { ConfigProvider, useConfig } from './context/ConfigContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { UiProvider } from './context/UiContext.jsx';

import AnnouncementBar from './components/layout/AnnouncementBar.jsx';
import SiteHeader from './components/layout/SiteHeader.jsx';
import SiteFooter from './components/layout/SiteFooter.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import SearchPanel from './components/search/SearchPanel.jsx';
import ToastViewport from './components/ui/ToastViewport.jsx';

import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import FaqPage from './pages/FaqPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function BootScreen({ children }) {
  const { status, reload } = useConfig();

  if (status === 'loading') {
    return (
      <div className="boot" role="status" aria-live="polite">
        <span className="boot__mark">LUNORA</span>
        <span className="boot__text">در حال آماده‌سازی فروشگاه…</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="boot boot--error">
        <span className="boot__mark">LUNORA</span>
        <p>ارتباط با فروشگاه برقرار نشد. اتصال شبکه را بررسی کنید و دوباره تلاش کنید.</p>
        <button type="button" className="btn btn--dark" onClick={reload}>
          تلاش دوباره
        </button>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <ConfigProvider>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            <UiProvider>
              <ScrollToTop />
              <a className="skip-link" href="#main">
                پرش به محتوای اصلی
              </a>
              <BootScreen>
                <AnnouncementBar />
                <SiteHeader />
                <main id="main" tabIndex={-1}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/product/:slug" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <SiteFooter />
                <CartDrawer />
                <SearchPanel />
                <ToastViewport />
              </BootScreen>
            </UiProvider>
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </ConfigProvider>
  );
}
