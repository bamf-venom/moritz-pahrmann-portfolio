import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    vorname: '',
    nachname: '',
    email: '',
    betreff: '',
    nachricht: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    
    if (type === 'success') {
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 8000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.vorname || !formData.nachname || !formData.email || !formData.nachricht) {
      showMessage('Bitte füllen Sie alle Pflichtfelder (*) aus.', 'error');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send to backend
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Contact form submitted to backend:', result);
        
        // Also send via EmailJS for immediate email notification
        const templateParams = {
          name: `${formData.vorname} ${formData.nachname}`,
          message: formData.nachricht,
          time: new Date().toLocaleString('de-DE'),
          subjekt: formData.betreff || 'Contact from Portfolio',
          from_email: formData.email,
          to_email: 'moritzpahrmann6@gmail.com'
        };
        
        // EmailJS integration (using the credentials from the original contact.html)
        if (window.emailjs) {
          try {
            await window.emailjs.send(
              'service_604p3x6',
              'template_o3ugp57',
              templateParams
            );
          } catch (emailError) {
            console.log('EmailJS error (non-critical):', emailError);
          }
        }
        
        showMessage(`✅ Vielen Dank für Ihre Nachricht! Sie wurde erfolgreich gespeichert und an moritzpahrmann6@gmail.com gesendet.

Von: ${templateParams.name}
Email: ${templateParams.from_email}
Betreff: ${templateParams.subjekt}
Gesendet: ${templateParams.time}

Ich werde mich bald bei Ihnen melden.`, 'success');
        
        // Reset form
        setFormData({
          vorname: '',
          nachname: '',
          email: '',
          betreff: '',
          nachricht: ''
        });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showMessage('❌ Entschuldigung, beim Senden der Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie mich direkt unter moritzpahrmann6@gmail.com', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Contact Content */}
      <main className="contact-main mt-20 min-h-[calc(100vh-80px)]">
        <section className="contact-hero py-20 px-12 bg-black">
          <div className="contact-container max-w-6xl mx-auto">
            <h1 className="page-title text-6xl md:text-8xl lg:text-9xl font-bold mb-16 text-white">Contact</h1>
            
            <div className="contact-content grid grid-cols-1 lg:grid-cols-5 gap-20 items-start">
              <div className="contact-info lg:col-span-2 text-white">
                <h2 className="text-3xl font-semibold mb-4 leading-tight">Get in Contact with Moritz Pahrmann</h2>
                <p className="contact-subtitle text-base opacity-80 mb-10">Please write in English or german</p>
                
                <div className="contact-details flex flex-col gap-4">
                  <div className="contact-item text-base leading-relaxed">
                    <strong className="text-green-400 font-semibold">Email:</strong> moritzpahrmann6@gmail.com
                  </div>
                  <div className="contact-item text-base leading-relaxed">
                    <strong className="text-green-400 font-semibold">Telefon:</strong> (49) 152 6984
                  </div>
                </div>
              </div>
              
              <div className="contact-form-section lg:col-span-3">
                {/* Success/Error Message Area */}
                {message && (
                  <div className={`form-message py-4 px-5 rounded-md mb-5 text-left font-medium leading-relaxed border ${
                    messageType === 'success' 
                      ? 'bg-green-900/40 text-green-400 border-green-400' 
                      : 'bg-red-900/40 text-red-400 border-red-400'
                  }`}>
                    {message.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                )}
                
                <form className="contact-form bg-gray-900 p-10 rounded-xl border border-white/10" onSubmit={handleSubmit}>
                  <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div className="form-group flex flex-col mb-6">
                      <label htmlFor="vorname" className="text-white font-medium mb-2 text-sm">Vorname *</label>
                      <input 
                        type="text" 
                        id="vorname" 
                        name="vorname" 
                        required
                        value={formData.vorname}
                        onChange={handleInputChange}
                        className="bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white text-base transition-all duration-300 focus:outline-none focus:border-green-400 focus:bg-gray-600"
                      />
                    </div>
                    <div className="form-group flex flex-col mb-6">
                      <label htmlFor="nachname" className="text-white font-medium mb-2 text-sm">Nachname *</label>
                      <input 
                        type="text" 
                        id="nachname" 
                        name="nachname" 
                        required
                        value={formData.nachname}
                        onChange={handleInputChange}
                        className="bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white text-base transition-all duration-300 focus:outline-none focus:border-green-400 focus:bg-gray-600"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group flex flex-col mb-6">
                    <label htmlFor="email" className="text-white font-medium mb-2 text-sm">E-Mail-Adresse *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white text-base transition-all duration-300 focus:outline-none focus:border-green-400 focus:bg-gray-600"
                    />
                  </div>
                  
                  <div className="form-group flex flex-col mb-6">
                    <label htmlFor="betreff" className="text-white font-medium mb-2 text-sm">Betreff</label>
                    <input 
                      type="text" 
                      id="betreff" 
                      name="betreff" 
                      placeholder="Subject of your message"
                      value={formData.betreff}
                      onChange={handleInputChange}
                      className="bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white text-base transition-all duration-300 focus:outline-none focus:border-green-400 focus:bg-gray-600"
                    />
                  </div>
                  
                  <div className="form-group flex flex-col mb-6">
                    <label htmlFor="nachricht" className="text-white font-medium mb-2 text-sm">Nachricht/Unterzeigen *</label>
                    <textarea 
                      id="nachricht" 
                      name="nachricht" 
                      rows="6" 
                      required 
                      placeholder="Your message here..."
                      value={formData.nachricht}
                      onChange={handleInputChange}
                      className="bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white text-base resize-y min-h-32 transition-all duration-300 focus:outline-none focus:border-green-400 focus:bg-gray-600"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-btn bg-green-400 text-black border-none py-4 px-10 rounded-md text-base font-semibold cursor-pointer transition-all duration-300 w-full hover:bg-green-500 hover:-translate-y-1 hover:shadow-green-400/30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>📧 Sending...</>
                    ) : (
                      'Send'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;