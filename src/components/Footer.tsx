import React from 'react';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useContext } from 'react';

const Footer: React.FC = () => {
  const { isDark } = useTheme();
  // Try to access setCurrentPage from context or window if available
  // Fallback: use custom event for navigation

  // Helper to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to scroll to featured section
  const scrollToFeatured = () => {
    const featured = document.getElementById('product-grid');
    if (featured) {
      featured.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on home, go to home and then scroll
      window.location.hash = '#featured';
      setTimeout(() => {
        const f = document.getElementById('product-grid');
        if (f) f.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  // Helper to go to new collections page
  const goToNewCollections = () => {
    if ((window as any).setCurrentPage) {
      (window as any).setCurrentPage('new-collections');
      setTimeout(scrollToTop, 300);
    } else {
      window.dispatchEvent(new CustomEvent('navigateToPage', { detail: { page: 'new-collections' } }));
      setTimeout(scrollToTop, 300);
    }
  };

  return (
    <footer className={`footer ${isDark ? 'dark' : ''}`}>
      <div className="footer-container">
        <div className="footer-section">
          <h3>DayKart</h3>
          <p>New Collection of Hostel needs 2025</p>
        </div>

        <div className="footer-section">
          <h3>EXPLORE</h3>
          <ul className="footer-links">
            <li><a href="#" onClick={e => { e.preventDefault(); scrollToTop(); }}>Home</a></li>
            <li><a href="#" onClick={e => { e.preventDefault(); scrollToFeatured(); }}>Featured</a></li>
            <li><a href="#">Fancy</a></li>
            <li><a href="#" onClick={e => { e.preventDefault(); goToNewCollections(); }}>New</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>SUPPORT</h3>
          <ul className="footer-links">
            <li><a href="https://www.daykart.in/policies/terms.html" target="_blank">Terms & Conditions</a></li>
            <li><a href="https://www.daykart.in/policies/refund.html" target="_blank">Refund Policy</a></li>
            <li><a href="https://www.daykart.in/policies/privacy.html"target="_blank">Privacy Policy</a></li>
            <li><a href="https://www.daykart.in/policies/shipping.html"target="_blank">Shipping Policy</a></li>
            <li><a href="https://www.daykart.in/policies/Contact.html"target="_blank">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <div className="footer-social">
            <a href="#" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="WhatsApp">
              <MessageCircle size={20} />
            </a>
            <a href="#" aria-label="Google">
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>G</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 DayKart. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;