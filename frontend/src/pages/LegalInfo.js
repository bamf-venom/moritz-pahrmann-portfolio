import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LegalInfo = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Legal Info Content */}
      <main className="legal-main mt-20 min-h-[calc(100vh-80px)]">
        <section className="legal-hero py-20 px-12 bg-black">
          <div className="legal-container max-w-6xl mx-auto">
            <h1 className="page-title text-6xl md:text-8xl lg:text-9xl font-bold mb-16 text-white">Legal Info</h1>
            
            <div className="legal-content text-white">
              <div className="legal-section">
                <h2 className="text-3xl font-semibold mb-5 text-green-400">Impressum</h2>
                <p className="last-updated italic text-gray-400 mb-10">Angaben gemäß § 5 TMG</p>
                
                <h3 className="text-xl font-semibold my-8 mb-4 text-white">Verantwortlich für den Inhalt</h3>
                <div className="contact-info bg-gray-900 p-6 rounded-lg border border-white/10 mt-5">
                  <p className="m-0 leading-relaxed">
                    <strong>Moritz Pahrmann</strong><br/>
                    VFX Artist & Student<br/><br/>
                    E-Mail: moritzpahrmann6@gmail.com<br/>
                    Telefon: (49) 152 6984
                  </p>
                </div>
                
                <h3 className="text-xl font-semibold my-8 mb-4 text-white">Haftung für Inhalte</h3>
                <p className="text-base leading-loose mb-5 opacity-90">Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
                
                <h3 className="text-xl font-semibold my-8 mb-4 text-white">Haftung für Links</h3>
                <p className="text-base leading-loose mb-5 opacity-90">Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
                
                <h3 className="text-xl font-semibold my-8 mb-4 text-white">Urheberrecht</h3>
                <p className="text-base leading-loose mb-5 opacity-90">Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
                
                <h3 className="text-xl font-semibold my-8 mb-4 text-white">Streitschlichtung</h3>
                <p className="text-base leading-loose mb-5 opacity-90">Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">https://ec.europa.eu/consumers/odr/</a></p>
                <p className="text-base leading-loose mb-5 opacity-90">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LegalInfo;