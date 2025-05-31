import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DataProtection = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Data Protection Content */}
      <main className="legal-main mt-20 min-h-[calc(100vh-80px)]">
        <section className="legal-hero py-20 px-12 bg-black">
          <div className="legal-container max-w-6xl mx-auto">
            <h1 className="page-title text-6xl md:text-8xl lg:text-9xl font-bold mb-16 text-white">Datenschutz</h1>
            
            <div className="legal-content text-white">
              <div className="legal-section">
                <h2 className="text-3xl font-semibold mb-5 text-green-400">Datenschutzerklärung</h2>
                <p className="last-updated italic text-gray-400 mb-10">Zuletzt aktualisiert: January 2024</p>
                
                <h3 className="text-xl font-semibold my-8 mb-4 text-white">1. Allgemeine Hinweise</h3>
                <p className="text-base leading-loose mb-5 opacity-90">Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
                
                <h3 className="text-xl font-semibold my-8 mb-4 text-white">2. Datenerfassung auf dieser Website</h3>
                <p className="text-base leading-loose mb-5 opacity-90">Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
                
                <h3 className="text-xl font-semibold my-8 mb-4 text-white">3. Wie erfassen wir Ihre Daten?</h3>
                <p className="text-base leading-loose mb-5 opacity-90">Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.</p>
                
                <h3 className="text-xl font-semibold my-8 mb-4 text-white">4. Wofür nutzen wir Ihre Daten?</h3>
                <p className="text-base leading-loose mb-5 opacity-90">Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.</p>
                
                <h3 className="text-xl font-semibold my-8 mb-4 text-white">5. Welche Rechte haben Sie bezüglich Ihrer Daten?</h3>
                <p className="text-base leading-loose mb-5 opacity-90">Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.</p>
                
                <h3 className="text-xl font-semibold my-8 mb-4 text-white">6. Kontakt</h3>
                <p className="text-base leading-loose mb-5 opacity-90">Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten, bei Auskünften, Berichtigung, Sperrung oder Löschung von Daten wenden Sie sich bitte an:</p>
                <div className="contact-info bg-gray-900 p-6 rounded-lg border border-white/10 mt-5">
                  <p className="m-0 leading-relaxed">
                    <strong>Moritz Pahrmann</strong><br/>
                    Email: moritzpahrmann6@gmail.com<br/>
                    Telefon: (49) 152 6984
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DataProtection;