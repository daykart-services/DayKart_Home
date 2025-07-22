import React, { useState, useEffect } from 'react';
import { ThemeProvider, UserProvider, ProductsProvider } from './components/ThemeContext';
import { CartLikeProvider } from './components/CartLikeContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import DiscountNewsletter from './components/DiscountNewsletter';
import Footer from './components/Footer';
import BedsPage from './components/pages/BedsPage';
import StationaryPage from './components/pages/StationaryPage';
import BathwarePage from './components/pages/BathwarePage';
import DormPage from './components/pages/DormPage';
import NewCollectionsPage from './components/pages/NewCollectionsPage';
import Dashboard from './components/pages/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail && e.detail.page) {
        setCurrentPage(e.detail.page);
      }
    };
    window.addEventListener('navigateToPage', handler);
    return () => window.removeEventListener('navigateToPage', handler);
  }, []);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'beds':
        return <BedsPage />;
      case 'stationary':
        return <StationaryPage />;
      case 'bathware':
        return <BathwarePage />;
      case 'dorm':
        return <DormPage />;
      case 'new-collections':
        return <NewCollectionsPage />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return (
          <>
            <Hero />
            <ProductGrid />
            <DiscountNewsletter />
            {/* Video section only on home page */}
            <div className="flex justify-center my-12">
              <div className="w-full max-w-2xl rounded-xl overflow-hidden shadow-lg">
                <video controls poster="https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800" className="w-full h-72 object-cover">
                  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="p-4 bg-white dark:bg-black">
                  <h3 className="text-lg font-semibold mb-2">How to Book a Product on DayKart</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Watch this quick video to learn how to book your favorite products easily on our platform.</p>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <ThemeProvider>
      <UserProvider>
        <ProductsProvider>
          <CartLikeProvider>
            <div className="min-h-screen">
              <Navigation onPageChange={handlePageChange} />
              <div className={currentPage === 'dashboard' ? 'pt-24' : 'pt-16'}>
                {renderPage()}
                <Footer />
              </div>
            </div>
          </CartLikeProvider>
        </ProductsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;