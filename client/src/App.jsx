import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/site/Header.jsx';
import Footer from './components/site/Footer.jsx';
import CartDrawer from './components/site/CartDrawer.jsx';
import ScrollProgress from './components/site/ScrollProgress.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Category from './pages/Category.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import TrackOrder from './pages/TrackOrder.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Account from './pages/Account.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import InfoPage from './pages/InfoPage.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-soft focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        رفتن به محتوای اصلی
      </a>

      <Header />

      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:orderNumber" element={<OrderConfirmation />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<InfoPage slug="about" />} />
          <Route path="/faq" element={<InfoPage slug="faq" />} />
          <Route path="/size-guide" element={<InfoPage slug="size-guide" />} />
          <Route path="/shipping-returns" element={<InfoPage slug="shipping-returns" />} />
          <Route path="/privacy" element={<InfoPage slug="privacy" />} />
          <Route path="/terms" element={<InfoPage slug="terms" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
