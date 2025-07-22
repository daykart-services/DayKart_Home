import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';
import { useRef } from 'react';

const Hero: React.FC = () => {
  const { isDark } = useTheme();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  // Add a state to track if the device is mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const productGrid = document.getElementById('product-grid');
      if (!productGrid) return;
      const gridTop = productGrid.getBoundingClientRect().top;
      setShowScrollIndicator(gridTop > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleIndicatorClick = () => {
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
      productGrid.scrollIntoView({ behavior: 'smooth' });
      setShowScrollIndicator(false);
    }
  };

  return (
    <main className="l-main" ref={heroRef}>
      <section className={`home ${isDark ? 'home-dark' : ''}`} id="home">
        <div className="home-container bd-grid">
          <div className="home-sneaker">
            <div className={`home-shape ${isDark ? 'home-shape-dark' : ''}`}></div>
            <img src="https://pngimg.com/d/mattresse_PNG63169.png" alt="" className="home-img" />
          </div>

          <div className="home-data">
            <span className={`home-new ${isDark ? 'text-gray-300' : ''}`}>New in</span>
            <h1 className={`home-title ${isDark ? 'text-white' : ''}`}
              style={{
                fontFamily: "'Didot', 'Bodoni MT', 'Didot LT STD', 'Bodoni 72', 'serif'",
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700
              }}
            >
              PREMIUM <br/>COLLECTION
            </h1>
            <p className={`home-description ${isDark ? 'text-gray-300' : ''}`}>
            Explore our new collection and make yourself feel at home.
            </p>
            <a href="#" className={`button ${isDark ? 'button-dark' : ''}`}>
              Explore Now
            </a>
          </div>
        </div>
        {showScrollIndicator && !isMobile && (
          <div
            onClick={handleIndicatorClick}
            style={{ position: 'absolute', left: '50%', bottom: 24, transform: 'translateX(-50%)', cursor: 'pointer', zIndex: 10 }}
            aria-label="Scroll to products"
          >
            <div style={{ width: 32, height: 48, borderRadius: 16, border: `2px solid ${isDark ? '#fff' : '#222'}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)' }}>
              <div style={{ width: 6, height: 12, borderRadius: 3, background: isDark ? '#fff' : '#222', marginBottom: 8, transition: 'background 0.3s' }} />
            </div>
            <span style={{ display: 'block', marginTop: 8, color: isDark ? '#fff' : '#222', fontSize: 12, fontFamily: 'Poppins, Inter, sans-serif', textAlign: 'center', letterSpacing: 1 }}>Scroll</span>
          </div>
        )}
      </section>
    </main>
  );
};

export default Hero;