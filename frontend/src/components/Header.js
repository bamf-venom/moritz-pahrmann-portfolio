import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header fixed top-0 w-full z-50 bg-black bg-opacity-90 backdrop-blur-sm">
      <nav className="nav flex justify-between items-center px-12 py-5 border-b border-white border-opacity-10">
        <div className="nav-logo">
          <Link to="/" className="text-2xl font-extrabold text-white no-underline tracking-tight">MBP</Link>
        </div>
        <div className="nav-links flex gap-8">
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>About me</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link>
          <Link to="/data-protection" className={`nav-link ${isActive('/data-protection')}`}>data protection</Link>
          <Link to="/legal-info" className={`nav-link ${isActive('/legal-info')}`}>Legal info</Link>
        </div>
        <div className="nav-social flex gap-4">
          <a href="#" className="social-icon text-white no-underline text-lg transition-all duration-300 hover:text-green-400 hover:-translate-y-1">📷</a>
          <a href="#" className="social-icon text-white no-underline text-lg transition-all duration-300 hover:text-green-400 hover:-translate-y-1">📧</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;