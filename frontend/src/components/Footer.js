import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer py-10 px-12 bg-gray-900 border-t border-white border-opacity-10 flex justify-between items-center">
      <p className="text-sm opacity-70">&copy; 2035 Moritz Pahrmann VFX</p>
      <div className="footer-links flex gap-8">
        <Link to="/data-protection" className="text-white no-underline text-sm opacity-70 transition-all duration-300 hover:opacity-100 hover:text-green-400">Datenschutz</Link>
        <Link to="/legal-info" className="text-white no-underline text-sm opacity-70 transition-all duration-300 hover:opacity-100 hover:text-green-400">Legal Info</Link>
      </div>
    </footer>
  );
};

export default Footer;