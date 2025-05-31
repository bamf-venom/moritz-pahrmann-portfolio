import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import DataProtection from './pages/DataProtection';
import LegalInfo from './pages/LegalInfo';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/data-protection" element={<DataProtection />} />
          <Route path="/legal-info" element={<LegalInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;