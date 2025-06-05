// =========================
// LOADING ANIMATION SYSTEM
// =========================

// Loading Animation Controller
class LoadingController {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.pageTransition = document.getElementById('pageTransition');
        this.isLoading = true;
        this.init();
    }

    init() {
        // Show loading screen initially
        this.showLoadingScreen();
        
        // Handle page load completion
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.handlePageLoad();
            });
        } else {
            this.handlePageLoad();
        }

        // Add page transition listeners
        this.addPageTransitionListeners();
    }

    showLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex';
            this.loadingScreen.classList.remove('fade-out');
        }
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                this.isLoading = false;
            }, 800);
        }
    }

    handlePageLoad() {
        const startTime = performance.now();
        let hasActualLoading = false;
        
        // Check if we actually need to load resources
        const images = document.querySelectorAll('img');
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        
        // Only show loading if there are actually resources to load
        if (images.length > 0 || stylesheets.length > 0) {
            hasActualLoading = true;
        }
        
        // If page is already loaded or very fast, hide immediately
        if (document.readyState === 'complete') {
            const loadTime = performance.now() - startTime;
            if (loadTime < 100 && !hasActualLoading) {
                // Very fast load, no need for loading screen
                setTimeout(() => {
                    this.hideLoadingScreen();
                    this.animatePageContent();
                }, 100);
                return;
            }
        }
        
        // Wait for all resources to actually load
        window.addEventListener('load', () => {
            const actualLoadTime = performance.now() - startTime;
            
            // Only show loading animation if it took meaningful time
            if (actualLoadTime > 200 || hasActualLoading) {
                // Add small buffer for visual smoothness (max 300ms)
                const bufferTime = Math.min(300, actualLoadTime * 0.2);
                setTimeout(() => {
                    this.hideLoadingScreen();
                    this.animatePageContent();
                }, bufferTime);
            } else {
                // Immediate hide for very fast loads
                this.hideLoadingScreen();
                this.animatePageContent();
            }
        });
    }

    animatePageContent() {
        // Animate page elements on load
        const elements = document.querySelectorAll('.fade-in');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 100);
        });
    }

    addPageTransitionListeners() {
        // Add transition effects to navigation links
        const navLinks = document.querySelectorAll('a[href$=".html"], .nav-logo a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Don't animate external links or same page links
                if (!href || href.startsWith('http') || href.startsWith('#')) {
                    return;
                }
                
                e.preventDefault();
                this.showPageTransition(href);
            });
        });
    }

    showPageTransition(href) {
        // Check if it's actually a different page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const targetPage = href.split('/').pop();
        
        // If it's the same page, don't show transition
        if (currentPage === targetPage) {
            return;
        }
        
        if (this.pageTransition) {
            this.pageTransition.classList.add('show');
            
            // Shorter transition for page navigation
            setTimeout(() => {
                window.location.href = href;
            }, 200);
        } else {
            window.location.href = href;
        }
    }
}

// Initialize loading controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LoadingController();
});

// =========================
// LANGUAGE TRANSLATIONS
// =========================

const translations = {
    en: {
        // Navigation
        'about': 'About me',
        'contact': 'Contact',
        'dataProtection': 'data protection',
        'legalInfo': 'Legal info',
        
        // Hero section
        'heroTitle': 'Moritz Pahrmann',
        'heroSubtitle': 'VFX ARTIST',
        
        // Story section
        'myStory': 'My<br>Story',
        'readMore': 'Read More',
        'getToKnow': 'Get to Know me',
        'storyText1': 'I am currently a student specializing in 3D Visual Effects at PIXL VISN and would like to introduce my work and connect with you.',
        'storyText2': 'I create high-quality 3D renders and designs that can support your next digital visualization project.',
        
        // Projects section
        'projects': 'PROJEKTS',
        'projectsDescription': 'This is where I showcase a selection of 3D renders I created during my studies and for freelance projects. Each piece reflects my passion for visual storytelling, technical growth, and creative exploration in the world of digital design.',
        
        // Student work
        'studentWork': 'Student Work',
        'moreVideos': 'More Videos',
        'hideVideos': 'Hide Videos',
        'playVideo': 'Play Video',
        
        // Skills
        'softwareSkills': 'Software Skills',
        
        // About page - UPDATED TEXT
        'aboutMe': 'About me',
        'aboutIntro': "I'm a 20-year-old student currently pursuing my passion for 3D visual effects, with the goal of building my own freelance career in the industry. In April 2024, I began my journey at PIXL VISN, where I quickly discovered that 3D isn't just a field of study for me—it's something I've truly fallen in love with.",
        'aboutText1': 'What excites me most about working in 3D is the constant variety of challenges, whether creative or technical. I enjoy pushing boundaries, solving problems, and learning new techniques that help me grow with every project. From concept to final render, I see each piece as an opportunity to tell a story, express an idea, or bring an imagined world to life.',
        'aboutText2': 'My aim is to express my creativity through 3D visual effects while working on a wide range of projects—whether it\'s environments, product visualization, motion graphics, or something entirely new. I\'m always open to collaboration and new experiences, and I\'m excited to continue evolving as an artist in this dynamic and ever-changing field.',
        'myCustomers': 'My customers',
        'customersText1': 'Here you\'ll find an overview of some of my valued clients and collaborators.',
        'customersText2': 'Each project and partnership has contributed to my growth as a 3D artist helping me expand my skills and approach. Whether it\'s for commercial use or artistic requirements.',
        'customersText3': 'The diversity of my clients reflects not only the versatility of my work, but also the effectiveness of my creative approach.',
        
        // Contact page
        'contactTitle': 'Contact',
        'contactSubtitle': 'Get in Contact with Moritz Pahrmann',
        'contactLanguageNote': 'Please write in English or German',
        'email': 'Email:',
        'phone': 'Phone:',
        'firstName': 'First Name *',
        'lastName': 'Last Name *',
        'emailAddress': 'Email Address *',
        'subject': 'Subject',
        'message': 'Message *',
        'send': 'Send',
        'sending': '📧 Sending...',
        
        // Email confirmation messages
        'emailSuccess': '✅ Thank you for your message! It has been successfully sent to moritzpahrmann6@gmail.com.\n\nFrom: {name}\nEmail: {email}\nSubject: {subject}\nSent: {time}\n\nI will get back to you soon.',
        'emailError': '❌ Sorry, an error occurred while sending the message. Please try again or contact me directly at moritzpahrmann6@gmail.com',
        'emailValidationRequired': 'Please fill in all required fields (*).',
        'emailValidationInvalid': 'Please enter a valid email address.',
        
        // Data Protection page - UPDATED CONTENT
        'dataProtectionTitle': 'Data Protection',
        'dataProtectionHeading': 'Data Protection',
        'lastUpdated': 'As a freelance 3D and VFX artist',
        'dataProtectionIntro': 'As a freelance 3D and VFX artist, I treat all client data, project files, and creative materials with the highest level of confidentiality and care. I understand that many projects involve sensitive content, proprietary designs, or unreleased visual material.',
        'dataProtectionPolicy': 'Any information, files, or communication shared with me will not be passed on to third parties and will only be used for the purposes of the agreed project. All data is stored securely and handled in accordance with current data protection regulations (such as the GDPR, where applicable).',
        'dataProtectionContact': 'If you have any questions about how your data is handled, or if you require a confidentiality agreement (NDA), feel free to reach out.',
        'ownershipTitle': 'Ownership of Original Work',
        'ownershipText': 'All original content that I create — including 3D models, textures, animations, simulations, compositing work, and renders — is, by default, protected under copyright law. As the creator, I hold the original intellectual property rights to these works unless explicitly transferred through a written agreement.',
        'licensingText': 'Clients purchasing services from me typically receive a license to use the final deliverables for the agreed-upon purposes (e.g., marketing, games, film, etc.). The scope of this license — whether it\'s exclusive or non-exclusive, limited by time, geography, or usage — will be clearly defined in our agreement.',
        'transferTitle': 'Transfer of Rights',
        'transferText': 'If full ownership or exclusive rights are required, this must be stated in writing and may involve an additional fee, depending on the scope and intended use. I\'m always open to discussing custom licensing options that suit your project needs.',
        'thirdPartyTitle': 'Use of Third-Party Assets',
        'thirdPartyIntro': 'In some cases, projects may incorporate third-party assets (e.g., stock models, textures, plugins, sound effects). When this occurs:',
        'thirdPartyLicensing': 'I ensure that all third-party content used is properly licensed for commercial use.',
        'thirdPartyDocumentation': 'I retain documentation of all licenses to protect both myself and my clients.',
        'clientAssets': 'If a client provides third-party assets, I assume they have the right to use and share them. It is the client\'s responsibility to ensure legal clearance for such materials.',
        'confidentialityTitle': 'Confidentiality',
        'confidentialityText': 'Any proprietary materials, scripts, or concepts shared with me remain strictly confidential. I\'m happy to sign NDAs upon request and handle sensitive materials with care.',
        'portfolioTitle': 'Portfolio Use',
        'portfolioText': 'Unless otherwise agreed upon, I reserve the right to display completed work in my portfolio and on social media for self-promotion. If a project is under embargo or contains confidential information, I will withhold public sharing until permission is granted.',
        
        // Legal Info page
        'legalInfoTitle': 'Legal Info',
        'imprintTitle': 'Imprint',
        'accordingTo': 'According to § 5 TMG',
        'responsibleTitle': 'Responsible for content according to § 55 Abs. 2 RStV:',
        'responsibleName': 'Moritz Pahrmann',
        'responsibleSubtitle': 'VFX Artist & Student',
        'responsibleEmail': 'E-Mail: moritzpahrmann6@gmail.com',
        'responsiblePhone': 'Phone: (+49) 1511 7809220',
        'responsibleAdress': 'Adresse: Am Mondschein 26, 59557 Lippstadt',
        'contentLiabilityTitle': 'Liability for Content',
        'contentLiabilityText': 'The contents of this website have been created with great care. As a private site operator, I am responsible for my own content in accordance with § 7 (1) TMG. However, I am not obliged to monitor transmitted or stored third-party information (§§ 8–10 TMG).',
        'linksLiabilityTitle': 'Liability for Links',
        'linksLiabilityText': 'This website may contain links to external websites. I have no influence over the content of these external sites. At the time of linking, no legal violations were evident.',
        'copyrightTitle': 'Copyright',
        'copyrightText': 'All content published on this website (e.g. texts, images, videos) is subject to German copyright law. Any use outside this website requires the prior written permission of the author.',
        'disputeResolutionTitle': 'Note on Online Dispute Resolution',
        'disputeResolutionText1': 'I am neither obligated nor willing to participate in a dispute resolution procedure before a consumer arbitration board.',
        
        // Footer
        'footerCopyright': '© 2025 Moritz Pahrmann VFX (MBP)',
        'privacy': 'Privacy Policy',
        'legalInfoFooter': 'Legal Info'
    },
    de: {
        // Navigation
        'about': 'Über mich',
        'contact': 'Kontakt',
        'dataProtection': 'Datenschutz',
        'legalInfo': 'Impressum',
        
        // Hero section
        'heroTitle': 'Moritz Pahrmann',
        'heroSubtitle': 'VFX ARTIST',
        
        // Story section
        'myStory': 'Meine<br>Geschichte',
        'readMore': 'Mehr erfahren',
        'getToKnow': 'Lerne mich kennen',
        'storyText1': 'Ich bin derzeit Student im Bereich 3D Visual Effects an der PIXL VISN Media Artist Acadamy und möchte hier meine Arbeit vorstellen und mit Ihnen in Kontakt treten.',
        'storyText2': 'Ich erstelle hochwertige 3D-Renderings und Designs, die Ihr nächstes digitales Visualisierungsprojekt unterstützen können.',
        
        // Projects section
        'projects': 'PROJEKTE',
        'projectsDescription': 'Hier zeige ich eine Auswahl von 3D-Renderings, die ich während meines Studiums und für freiberufliche Projekte erstellt habe. Jedes Stück spiegelt meine Leidenschaft für visuelles Storytelling, technisches Wachstum und kreative Erkundung in der Welt des digitalen Designs wider.',
        
        // Student work
        'studentWork': 'Studentenarbeiten',
        'moreVideos': 'Mehr Videos',
        'hideVideos': 'Videos ausblenden',
        'playVideo': 'Video abspielen',
        
        // Skills
        'softwareSkills': 'Software-Kenntnisse',
        
        // About page - UPDATED GERMAN TEXT
        'aboutMe': 'Über mich',
        'aboutIntro': 'Ich bin ein 20-jähriger Student, der derzeit seine Leidenschaft für 3D-Spezialeffekte verfolgt, mit dem Ziel, eine eigene freiberufliche Laufbahn in der Branche aufzubauen. Im April 2024 begann ich meine Reise bei PIXL VISN, wo ich schnell entdeckte, dass 3D für mich nicht nur ein Studienfeld ist – es ist etwas, in das ich mich wirklich verliebt habe.',
        'aboutText1': 'Was mich am meisten an der Arbeit mit 3D begeistert, ist die ständige Vielfalt der Herausforderungen, sei es kreativ oder technisch. Ich genieße es, Grenzen zu überschreiten, Probleme zu lösen und neue Techniken zu erlernen, die mir bei jedem Projekt helfen zu wachsen. Vom Konzept bis zum finalen Rendering sehe ich jedes Stück als Gelegenheit, eine Geschichte zu erzählen, eine Idee auszudrücken oder eine imaginäre Welt zum Leben zu erwecken.',
        'aboutText2': 'Mein Ziel ist es, meine Kreativität durch 3D-Spezialeffekte auszudrücken, während ich an einer Vielzahl von Projekten arbeite – sei es Umgebungen, Produktvisualisierung, Motion Graphics oder etwas völlig Neues. Ich bin immer offen für Zusammenarbeit und neue Erfahrungen und freue mich darauf, mich als Künstler in diesem dynamischen und sich ständig verändernden Bereich weiterzuentwickeln.',
        'myCustomers': 'Meine Kunden',
        'customersText1': 'Hier finden Sie eine Übersicht über einige meiner geschätzten Kunden und Kooperationspartner.',
        'customersText2': 'Jedes Projekt und jede Partnerschaft hat zu meinem Wachstum als 3D-Künstler beigetragen und mir geholfen, meine Fähigkeiten und meine Herangehensweise zu erweitern. Sei es für kommerzielle Nutzung oder künstlerische Anforderungen.',
        'customersText3': 'Die Vielfalt meiner Kunden spiegelt nicht nur die Vielseitigkeit meiner Arbeit wider, sondern auch die Wirksamkeit meines kreativen Ansatzes.',
        
        // Contact page
        'contactTitle': 'Kontakt',
        'contactSubtitle': 'Kontaktieren Sie Moritz Pahrmann',
        'contactLanguageNote': 'Bitte schreiben Sie auf Englisch oder Deutsch',
        'email': 'E-Mail:',
        'phone': 'Telefon:',
        'firstName': 'Vorname *',
        'lastName': 'Nachname *',
        'emailAddress': 'E-Mail-Adresse *',
        'subject': 'Betreff',
        'message': 'Nachricht *',
        'send': 'Senden',
        'sending': '📧 Wird gesendet...',
        
        // Email confirmation messages
        'emailSuccess': '✅ Vielen Dank für Ihre Nachricht! Sie wurde erfolgreich an moritzpahrmann6@gmail.com gesendet.\n\nVon: {name}\nEmail: {email}\nBetreff: {subject}\nGesendet: {time}\n\nIch werde mich bald bei Ihnen melden.',
        'emailError': '❌ Entschuldigung, beim Senden der Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie mich direkt unter moritzpahrmann6@gmail.com',
        'emailValidationRequired': 'Bitte füllen Sie alle Pflichtfelder (*) aus.',
        'emailValidationInvalid': 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
        
        // Data Protection page - UPDATED GERMAN CONTENT
        'dataProtectionTitle': 'Datenschutz',
        'dataProtectionHeading': 'Datenschutz',
        'lastUpdated': 'Als freiberuflicher 3D- und VFX-Künstler',
        'dataProtectionIntro': 'Als freiberuflicher 3D- und VFX-Künstler behandle ich alle Kundendaten, Projektdateien und kreativen Materialien mit höchster Vertraulichkeit und Sorgfalt. Ich verstehe, dass viele Projekte sensible Inhalte, proprietäre Designs oder unveröffentlichte visuelle Materialien beinhalten.',
        'dataProtectionPolicy': 'Alle Informationen, Dateien oder Kommunikation, die mit mir geteilt werden, werden nicht an Dritte weitergegeben und nur für die Zwecke des vereinbarten Projekts verwendet. Alle Daten werden sicher gespeichert und in Übereinstimmung mit den aktuellen Datenschutzbestimmungen (wie der DSGVO, wo anwendbar) behandelt.',
        'dataProtectionContact': 'Wenn Sie Fragen zum Umgang mit Ihren Daten haben oder eine Vertraulichkeitsvereinbarung (NDA) benötigen, können Sie sich gerne an mich wenden.',
        'ownershipTitle': 'Eigentum an Originalarbeiten',
        'ownershipText': 'Alle ursprünglichen Inhalte, die ich erstelle — einschließlich 3D-Modelle, Texturen, Animationen, Simulationen, Compositing-Arbeiten und Renderings — sind standardmäßig durch das Urheberrecht geschützt. Als Schöpfer halte ich die ursprünglichen Rechte am geistigen Eigentum an diesen Arbeiten, es sei denn, sie werden ausdrücklich durch eine schriftliche Vereinbarung übertragen.',
        'licensingText': 'Kunden, die Dienstleistungen von mir erwerben, erhalten typischerweise eine Lizenz zur Nutzung der finalen Ergebnisse für die vereinbarten Zwecke (z.B. Marketing, Spiele, Film, etc.). Der Umfang dieser Lizenz — ob exklusiv oder nicht-exklusiv, zeitlich, geografisch oder nach Nutzung begrenzt — wird in unserer Vereinbarung klar definiert.',
        'transferTitle': 'Übertragung von Rechten',
        'transferText': 'Wenn vollständiges Eigentum oder exklusive Rechte erforderlich sind, muss dies schriftlich festgehalten werden und kann je nach Umfang und beabsichtigter Nutzung eine zusätzliche Gebühr beinhalten. Ich bin immer offen für Gespräche über maßgeschneiderte Lizenzoptionen, die Ihren Projektanforderungen entsprechen.',
        'thirdPartyTitle': 'Verwendung von Drittanbieter-Assets',
        'thirdPartyIntro': 'In einigen Fällen können Projekte Drittanbieter-Assets (z.B. Stock-Modelle, Texturen, Plugins, Soundeffekte) enthalten. Wenn dies der Fall ist:',
        'thirdPartyLicensing': 'Ich stelle sicher, dass alle verwendeten Drittanbieter-Inhalte ordnungsgemäß für den kommerziellen Gebrauch lizenziert sind.',
        'thirdPartyDocumentation': 'Ich bewahre Dokumentationen aller Lizenzen auf, um sowohl mich als auch meine Kunden zu schützen.',
        'clientAssets': 'Wenn ein Kunde Drittanbieter-Assets bereitstellt, gehe ich davon aus, dass er das Recht hat, sie zu verwenden und zu teilen. Es liegt in der Verantwortung des Kunden, die rechtliche Freigabe für solche Materialien sicherzustellen.',
        'confidentialityTitle': 'Vertraulichkeit',
        'confidentialityText': 'Alle proprietären Materialien, Skripte oder Konzepte, die mit mir geteilt werden, bleiben streng vertraulich. Ich bin gerne bereit, auf Anfrage NDAs zu unterzeichnen und sensible Materialien mit Sorgfalt zu behandeln.',
        'portfolioTitle': 'Portfolio-Nutzung',
        'portfolioText': 'Sofern nicht anders vereinbart, behalte ich mir das Recht vor, abgeschlossene Arbeiten in meinem Portfolio und in sozialen Medien zur Selbstvermarktung zu zeigen. Wenn ein Projekt unter Embargo steht oder vertrauliche Informationen enthält, werde ich die öffentliche Veröffentlichung zurückhalten, bis die Erlaubnis erteilt wird.',
        
        // Legal Info page
        'legalInfoTitle': 'Impressum',
        'imprintTitle': 'Impressum',
        'accordingTo': 'Angaben gemäß § 5 TMG',
        'responsibleTitle': 'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:',
        'responsibleName': 'Moritz Pahrmann',
        'responsibleSubtitle': 'VFX Artist & Student',
        'responsibleEmail': 'E-Mail: moritzpahrmann6@gmail.com',
        'responsibleAdress': 'Adresse: Am Mondschein 26, 59557 Lippstadt',
        'responsiblePhone': 'Telefon: (+49) 1511 7809220',
        'contentLiabilityTitle': 'Haftung für Inhalte',
        'contentLiabilityText': 'Die Inhalte dieser Webseite wurden mit größter Sorgfalt erstellt. Als privater Seitenbetreiber bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte verantwortlich. Ich bin jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen (§§ 8–10 TMG).',
        'linksLiabilityTitle': 'Haftung für Links',
        'linksLiabilityText': 'Diese Webseite kann Links zu externen Webseiten enthalten. Für deren Inhalte übernehme ich keine Verantwortung. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar.',
        'copyrightTitle': 'Urheberrecht',
        'copyrightText': 'Alle auf dieser Webseite veröffentlichten Inhalte (z. B. Texte, Bilder, Videos) unterliegen dem deutschen Urheberrecht. Eine Verwendung außerhalb dieser Webseite ist nur mit ausdrücklicher Erlaubnis des Urhebers erlaubt.',
        'disputeResolutionTitle': 'Hinweis zur Online-Streitbeilegung',
        'disputeResolutionText1': 'Ich bin nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.:',
        
        // Footer
        'footerCopyright': '© 2025 Moritz Pahrmann VFX (MBP)',
        'privacy': 'Datenschutz',
        'legalInfoFooter': 'Impressum'
    }
};

// Current language state
let currentLanguage = localStorage.getItem('language') || 'en';

// Language toggle function
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'de' : 'en';
    localStorage.setItem('language', currentLanguage);
    updateLanguage();
    updateLanguageButton();
}

// Update language button text
function updateLanguageButton() {
    const langText = document.getElementById('langText');
    if (langText) {
        langText.textContent = currentLanguage.toUpperCase();
    }
}

// Update page content based on language
function updateLanguage() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = translations[currentLanguage][key];
                } else {
                    element.value = translations[currentLanguage][key];
                }
            } else {
                element.innerHTML = translations[currentLanguage][key];
            }
        }
    });
    updateLanguageButton();
}

// Add translation attributes to elements on page load
function addTranslationAttributes() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    const navTexts = ['about', 'contact', 'dataProtection', 'legalInfo'];
    navLinks.forEach((link, index) => {
        if (navTexts[index]) {
            link.setAttribute('data-translate', navTexts[index]);
        }
    });
    
    // Hero section
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroTitle) heroTitle.setAttribute('data-translate', 'heroTitle');
    if (heroSubtitle) heroSubtitle.setAttribute('data-translate', 'heroSubtitle');
    
    // Story section
    const storyH2 = document.querySelector('.story-content h2');
    const readMoreBtn = document.querySelector('.read-more-btn');
    const storyH3 = document.querySelector('.story-info h3');
    const storyParagraphs = document.querySelectorAll('.story-info p');
    
    if (storyH2) storyH2.setAttribute('data-translate', 'myStory');
    if (readMoreBtn) readMoreBtn.setAttribute('data-translate', 'readMore');
    if (storyH3) storyH3.setAttribute('data-translate', 'getToKnow');
    if (storyParagraphs[0]) storyParagraphs[0].setAttribute('data-translate', 'storyText1');
    if (storyParagraphs[1]) storyParagraphs[1].setAttribute('data-translate', 'storyText2');
    
    // Projects section
    const projectsTitle = document.querySelector('.projects-title');
    const projectsDescription = document.querySelector('.projects-description');
    if (projectsTitle) projectsTitle.setAttribute('data-translate', 'projects');
    if (projectsDescription) projectsDescription.setAttribute('data-translate', 'projectsDescription');
    
    // Student work
    const studentTitle = document.querySelector('.student-title');
    const moreVideosText = document.getElementById('moreVideosText');
    if (studentTitle) studentTitle.setAttribute('data-translate', 'studentWork');
    if (moreVideosText) moreVideosText.setAttribute('data-translate', 'moreVideos');
    
    // Skills
    const skillsTitle = document.querySelector('.skills-title');
    if (skillsTitle) skillsTitle.setAttribute('data-translate', 'softwareSkills');
    
    // Page titles
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        const currentPage = document.title.toLowerCase();
        if (currentPage.includes('about')) {
            pageTitle.setAttribute('data-translate', 'aboutMe');
        } else if (currentPage.includes('contact')) {
            pageTitle.setAttribute('data-translate', 'contactTitle');
        }
    }
    
    // About page specific
    const aboutIntro = document.querySelector('.intro-text');
    const aboutParagraphs = document.querySelectorAll('.about-text p:not(.intro-text)');
    const sectionTitle = document.querySelector('.section-title');
    const customersParagraphs = document.querySelectorAll('.customers-text p');
    
    if (aboutIntro) aboutIntro.setAttribute('data-translate', 'aboutIntro');
    if (aboutParagraphs[0]) aboutParagraphs[0].setAttribute('data-translate', 'aboutText1');
    if (aboutParagraphs[1]) aboutParagraphs[1].setAttribute('data-translate', 'aboutText2');
    if (sectionTitle) sectionTitle.setAttribute('data-translate', 'myCustomers');
    if (customersParagraphs[0]) customersParagraphs[0].setAttribute('data-translate', 'customersText1');
    if (customersParagraphs[1]) customersParagraphs[1].setAttribute('data-translate', 'customersText2');
    if (customersParagraphs[2]) customersParagraphs[2].setAttribute('data-translate', 'customersText3');
    
    // Contact page specific
    const contactSubtitle = document.querySelector('.contact-info h2');
    const contactLanguageNote = document.querySelector('.contact-subtitle');
    const formLabels = document.querySelectorAll('.form-group label');
    const submitBtnText = document.getElementById('btnText');
    
    if (contactSubtitle) contactSubtitle.setAttribute('data-translate', 'contactSubtitle');
    if (contactLanguageNote) contactLanguageNote.setAttribute('data-translate', 'contactLanguageNote');
    if (submitBtnText) submitBtnText.setAttribute('data-translate', 'send');
    
    // Form labels
    const formLabelKeys = ['firstName', 'lastName', 'emailAddress', 'subject', 'message'];
    formLabels.forEach((label, index) => {
        if (formLabelKeys[index]) {
            label.setAttribute('data-translate', formLabelKeys[index]);
        }
    });
    
    // Footer
    const footerCopyright = document.querySelector('.footer p');
    const footerLinks = document.querySelectorAll('.footer-links a');
    if (footerCopyright) footerCopyright.setAttribute('data-translate', 'footerCopyright');
    if (footerLinks[0]) footerLinks[0].setAttribute('data-translate', 'privacy');
    if (footerLinks[1]) footerLinks[1].setAttribute('data-translate', 'legalInfoFooter');
}

// Video gallery functions for the index page
function toggleVideoGallery() {
    const gallery = document.getElementById('videoGallery');
    const arrow = document.getElementById('moreVideosArrow');
    const text = document.getElementById('moreVideosText');
    
    if (!gallery || !arrow || !text) return;
    
    const isOpen = gallery.style.display !== 'none';
    
    if (isOpen) {
        // Close gallery
        gallery.classList.remove('show');
        setTimeout(() => {
            gallery.style.display = 'none';
        }, 500);
        arrow.classList.remove('rotated');
        text.setAttribute('data-translate', 'moreVideos');
        updateLanguage(); // Update text based on current language
    } else {
        // Open gallery
        gallery.style.display = 'block';
        setTimeout(() => {
            gallery.classList.add('show');
        }, 10);
        arrow.classList.add('rotated');
        text.setAttribute('data-translate', 'hideVideos');
        updateLanguage(); // Update text based on current language
    }
}

// =========================
// ENHANCED RIPPLE EFFECTS
// =========================

// Add enhanced ripple effect to buttons
function addRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('VFX Portfolio website loaded successfully!');
    
    // Initialize language on page load
    addTranslationAttributes();
    updateLanguage();
    
    // Add ripple effects to interactive elements
    const rippleElements = document.querySelectorAll('.skill-btn, .submit-btn, .more-videos-btn, .read-more-btn, .play-video-btn');
    rippleElements.forEach(element => {
        element.addEventListener('click', addRippleEffect);
    });
    
    // Enhanced hover effects removed for project cards to keep original speed
    // The CSS already handles the faster transitions
    
    // Parallax effect removed for hero section
    
    // Add smooth scroll behavior for navigation
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading state to external links
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', () => {
            link.style.opacity = '0.7';
            link.style.pointerEvents = 'none';
            
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.pointerEvents = 'auto';
            }, 2000);
        });
    });
    
    // Initialize intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.project-card, .skill-btn');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Add CSS for additional animations
const additionalStyles = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.6);
    width: 100px;
    height: 100px;
    margin-top: -50px;
    margin-left: -50px;
    animation: ripple 0.6s;
    opacity: 0;
    pointer-events: none;
}

@keyframes ripple {
    from {
        opacity: 1;
        transform: scale(0);
    }
    to {
        opacity: 0;
        transform: scale(4);
    }
}

.project-card.fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.project-card.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}

.skill-btn.fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
}

.skill-btn.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}
`;

// Inject additional styles
const style = document.createElement('style');
style.textContent = additionalStyles;
document.head.appendChild(style);