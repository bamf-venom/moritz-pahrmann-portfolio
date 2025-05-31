import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* About Me Content */}
      <main className="about-main mt-20 min-h-[calc(100vh-80px)]">
        <section className="about-hero py-20 px-12 bg-black">
          <div className="about-container max-w-6xl mx-auto">
            <h1 className="page-title text-6xl md:text-8xl lg:text-9xl font-bold mb-16 text-white">About me</h1>
            
            <div className="about-content grid grid-cols-1 lg:grid-cols-3 gap-20 items-start">
              <div className="about-text lg:col-span-2 text-white">
                <p className="intro-text text-xl font-semibold mb-8 leading-relaxed">I'm a 20-year-old student currently pursuing my passion for 3D visual effects, with my eyes set on working in this creative industry. My goal is to become a skilled professional in the field of visual effects and virtual production.</p>
                
                <p className="text-base leading-loose mb-6 opacity-90">What excites me the most about working in 3D is the constant variety of challenges whether creating art, technical, I enjoy pushing boundaries, solving problems, and learning new techniques that help me grow with every project I explore and complete each semester.</p>
                
                <p className="text-base leading-loose mb-6 opacity-90">My aim is to develop my creativity through 3D visual effects while working on a wide range of projects whether in environments, product visualization, character animation or even simulations, and I'm excited to continue working as an artist in the dynamic and ever-changing field.</p>
              </div>
              
              <div className="about-image">
                <div className="placeholder-image about-placeholder h-96 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-lg border-2 border-dashed border-gray-500 text-gray-300 font-semibold text-center transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-500 hover:to-gray-600 hover:border-gray-400">
                  <span>Profile Image<br/>(Replace with your photo)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* My Customers Section */}
        <section className="customers-section py-20 px-12 bg-gray-900">
          <div className="about-container max-w-6xl mx-auto">
            <h2 className="section-title text-5xl font-semibold mb-12 text-white">My customers</h2>
            
            <div className="customers-content grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="customers-text text-white">
                <p className="text-base leading-loose mb-5 opacity-90">Here you'll find an overview of some of my valued clients and collaborators.</p>
                
                <p className="text-base leading-loose mb-5 opacity-90">Each project and partnership has contributed to my growth as a 3D artist helping me expand my skills and approach. Whether it's for commercial use or artistic requirements.</p>
                
                <p className="text-base leading-loose mb-5 opacity-90">The diversity of my clients reflects not only the versatility of my work, but also the effectiveness of my creative approach.</p>
              </div>
              
              <div className="customers-gallery grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((item, index) => (
                  <div key={index} className="customer-item">
                    <div className="placeholder-image customer-placeholder h-32 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-sm border-2 border-dashed border-gray-500 text-gray-300 font-semibold text-center transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-500 hover:to-gray-600 hover:border-gray-400">
                      <span>Client Logo {item}<br/>(Replace)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;