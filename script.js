// =========================
// LAZY LOADING FUNCTIONALITY
// =========================

/**
 * Lazy Loading Image Observer
 * Uses Intersection Observer API for efficient lazy loading
 */
class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.images = [];
        this.init();
    }
    
    init() {
        // Check for Intersection Observer support
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                // Load images when they're 200px away from viewport
                rootMargin: '200px 0px',
                threshold: 0.01
            });
            
            this.observeImages();
        } else {
            // Fallback for browsers without Intersection Observer
            this.loadAllImages();
        }
    }
    
    observeImages() {
        // Find all images with lazy loading
        this.images = document.querySelectorAll('.lazy-load, img[data-src]');
        
        this.images.forEach(img => {
            // Skip if already loaded
            if (img.classList.contains('loaded')) return;
            
            this.imageObserver.observe(img);
        });
        
        console.log(`🔍 Lazy Loading: Observing ${this.images.length} images`);
    }
    
    loadImage(img) {
        return new Promise((resolve) => {
            const src = img.dataset.src || img.src;
            
            if (!src || img.classList.contains('loaded')) {
                resolve();
                return;
            }
            
            // Create a new image to preload
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                // Image loaded successfully
                img.src = src;
                img.classList.add('loaded');
                
                // Remove skeleton loading if it exists
                const container = img.closest('.lazy-image-container');
                if (container) {
                    container.classList.add('loaded');
                }
                
                console.log(`✅ Lazy Loading: Image loaded - ${src}`);
                resolve();
            };
            
            imageLoader.onerror = () => {
                // Image failed to load
                img.classList.add('loaded'); // Still mark as "loaded" to prevent retries
                console.log(`❌ Lazy Loading: Image failed - ${src}`);
                resolve();
            };
            
            // Start loading the image
            imageLoader.src = src;
        });
    }
    
    loadAllImages() {
        // Fallback: Load all images immediately
        this.images = document.querySelectorAll('.lazy-load, img[data-src]');
        this.images.forEach(img => {
            this.loadImage(img);
        });
    }
    
    // Public method to add new images for lazy loading
    addNewImages(newImages) {
        newImages.forEach(img => {
            if (!img.classList.contains('loaded')) {
                this.imageObserver.observe(img);
            }
        });
    }
    
    // Public method to force load all remaining images
    loadRemaining() {
        this.images.forEach(img => {
            if (!img.classList.contains('loaded')) {
                this.loadImage(img);
            }
        });
    }
}

// =========================
// RESPONSIVE IMAGE SWITCHING FUNCTIONALITY
// =========================

/**
 * Responsive Image Switcher for Hero Background
 * Switches between StartScene.png (mobile) and DesktopTumbnail.png (desktop/iPad)
 * FIXED: iPad portrait now shows mobile image, iPad landscape shows desktop image
 */
class ResponsiveImageSwitcher {
    constructor() {
        this.heroImage = document.getElementById('heroImage');
        this.heroPlaceholderText = document.getElementById('heroPlaceholderText');
        this.desktopBreakpoint = 1000; // Breakpoint for desktop vs mobile
        this.currentImageType = null; // Track current image type to avoid unnecessary switches
        
        this.images = {
            mobile: './Images/StartScene.png',
            desktop: './Images/DesktopTumbnail.png'
        };
        
        this.placeholderTexts = {
            mobile: 'StartScene.png<br>(Place your StartScene.png in Images folder)',
            desktop: 'DesktopTumbnail.png<br>(Place your DesktopTumbnail.png in Images folder)'
        };
        
        this.init();
    }
    
    init() {
        // Set initial image based on current screen size
        this.switchImage();
        
        // Listen for window resize events with throttling for better performance
        let resizeTimeout;
        
        // FIXED: Orientierungswechsel-Event für iPad (verbesserte Methode)
        window.addEventListener('orientationchange', () => {
            // Längere Verzögerung für iPad um sicherzustellen, dass die Orientierung komplett gewechselt hat
            setTimeout(() => {
                console.log('🔄 Orientierungswechsel erkannt - überprüfe Bild...');
                this.switchImage();
            }, 300);
        });
        
        // Zusätzlicher resize Event Listener für extra Sicherheit
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.isIPad()) {
                    console.log('🔄 iPad Resize erkannt - überprüfe Bild...');
                }
                this.switchImage();
            }, 200);
        });
        
        console.log('🖼️ iPad-optimierter Image Switcher initialisiert');
        console.log(`📱 Mobile (iPad Hochkant): ${this.images.mobile}`);
        console.log(`🖥️ Desktop (iPad Querformat): ${this.images.desktop}`);
        console.log('✅ iPad-Orientierung Fix angewendet: Hochkant = StartScene.png, Querformat = DesktopTumbnail.png');
    }
    
    // FIXED: Einfache und robuste iPad-Erkennung
    isIPad() {
        // iPad Detection - verschiedene Methoden für bessere Kompatibilität
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isIPadUA = /iPad/.test(userAgent);
        
        // Backup: Check für iPad-ähnliche Dimensionen und Touch-Support
        const width = window.innerWidth;
        const height = window.innerHeight;
        const hasTouch = 'ontouchstart' in window;
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        // iPad-typische Bildschirmauflösungen (verschiedene iPad-Modelle)
        const isIPadSize = (
            // iPad Air 4/5 (820x1180 portrait, 1180x820 landscape)
            (width >= 820 && width <= 1194 && height >= 820 && height <= 1180) ||
            // Andere iPad Größen
            (width >= 768 && width <= 1024 && height >= 768 && height <= 1366) ||
            // iPad Pro größen
            (width >= 1024 && width <= 1366 && height >= 768 && height <= 1024)
        );
        
        const hasHighDPI = devicePixelRatio >= 1.5;
        
        return isIPadUA || (isIPadSize && hasTouch && hasHighDPI);
    }
    
    // FIXED: Einfache Orientierungserkennung speziell für iPad
    isIPadPortrait() {
        if (!this.isIPad()) return false;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Einfache Regel: Portrait wenn Höhe größer als Breite
        const isPortraitByDimensions = height > width;
        
        // Zusätzliche Check mit CSS Media Query
        let isPortraitByCSS = isPortraitByDimensions; // Fallback
        if (window.matchMedia) {
            isPortraitByCSS = window.matchMedia("(orientation: portrait)").matches;
        }
        
        // Debug-Ausgabe
        console.log(`🔍 iPad Check: ${width}x${height}, Portrait by dimensions: ${isPortraitByDimensions}, CSS: ${isPortraitByCSS}`);
        
        return isPortraitByCSS;
    }
    
    switchImage() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // FIXED: Vereinfachte Logik für iPad-Orientierung
        let targetImageType;
        
        // Hero content element für Positionierungs-Anpassungen
        const heroContent = document.querySelector('.hero-content');
        
        if (this.isIPad()) {
            // FIXED: iPad-spezifische Logik
            const isPortrait = this.isIPadPortrait();
            
            if (isPortrait) {
                // iPad Hochkant → StartScene.png (mobile image)
                targetImageType = 'mobile';
                console.log('📱 iPad Hochkant erkannt → StartScene.png wird verwendet');
                
                // FIXED: Schrift für iPad Hochkant weiter nach rechts verschieben
                if (heroContent) {
                    heroContent.classList.add('ipad-portrait-text');
                    heroContent.classList.remove('ipad-landscape-text');
                    
                    // Debug: Prüfe ob die Klasse wirklich angewendet wurde
                    setTimeout(() => {
                        const hasClass = heroContent.classList.contains('ipad-portrait-text');
                        const computedStyle = window.getComputedStyle(heroContent);
                        const marginLeft = computedStyle.marginLeft;
                        console.log(`🔍 DEBUG iPad Hochkant:`);
                        console.log(`   - CSS-Klasse angewendet: ${hasClass}`);
                        console.log(`   - Aktuelle margin-left: ${marginLeft}`);
                        console.log(`   - Bildschirmgröße: ${width}x${height}`);
                    }, 100);
                    
                    console.log('✅ iPad Hochkant: Schrift WEIT nach rechts verschoben (70% + transforms)');
                }
            } else {
                // iPad Querformat → DesktopTumbnail.png (desktop image) 
                targetImageType = 'desktop';
                console.log('🖥️ iPad Querformat erkannt → DesktopTumbnail.png wird verwendet');
                
                // iPad Querformat: Normale Desktop-Position
                if (heroContent) {
                    heroContent.classList.remove('ipad-portrait-text');
                    heroContent.classList.add('ipad-landscape-text');
                    console.log('✅ iPad Querformat: Standard Desktop-Position');
                }
            }
        } else if (width >= this.desktopBreakpoint) {
            // Normaler Desktop (1000px+): Desktop image
            targetImageType = 'desktop';
            console.log('🖥️ Desktop erkannt → DesktopTumbnail.png');
            
            // Desktop: Normale Position
            if (heroContent) {
                heroContent.classList.remove('ipad-portrait-text', 'ipad-landscape-text');
            }
        } else {
            // Mobile/Kleine Tablets (<1000px und nicht iPad): Mobile image
            targetImageType = 'mobile';
            console.log('📱 Mobile erkannt → StartScene.png');
            
            // Mobile: Normale Position
            if (heroContent) {
                heroContent.classList.remove('ipad-portrait-text', 'ipad-landscape-text');
            }
        }
        
        // Only switch if the image type has actually changed
        if (this.currentImageType === targetImageType) {
            return;
        }
        
        this.currentImageType = targetImageType;
        const newImageSrc = this.images[targetImageType];
        const newPlaceholderText = this.placeholderTexts[targetImageType];
        
        if (this.heroImage) {
            // Add smooth transition effect
            this.heroImage.style.opacity = '0.7';
            this.heroImage.style.transition = 'opacity 0.3s ease';
            
            // Update data-src for lazy loading
            this.heroImage.dataset.src = newImageSrc;
            
            // Trigger lazy loading if available
            if (window.lazyImageLoader) {
                window.lazyImageLoader.loadImage(this.heroImage);
            } else {
                // Fallback: Change the image source directly
                this.heroImage.src = newImageSrc;
            }
            
            this.heroImage.alt = targetImageType === 'desktop' ? 'Desktop VFX Scene by Moritz Pahrmann' : '3D Scene by Moritz Pahrmann';
            
            // Reset opacity after a short delay
            setTimeout(() => {
                this.heroImage.style.opacity = '1';
            }, 100);
            
            console.log(`✅ GEWECHSELT zu ${targetImageType} Bild: ${newImageSrc}`);
        }
        
        // Update placeholder text for fallback
        if (this.heroPlaceholderText) {
            this.heroPlaceholderText.innerHTML = newPlaceholderText;
        }
    }
    
    // Public method to manually trigger image switch (for testing)
    forceSwitch(imageType = null) {
        if (imageType && (imageType === 'mobile' || imageType === 'desktop')) {
            this.currentImageType = null; // Reset to force switch
            const isDesktop = imageType === 'desktop';
            window.innerWidth = isDesktop ? this.desktopBreakpoint + 100 : this.desktopBreakpoint - 100;
        }
        this.currentImageType = null; // Force refresh
        this.switchImage();
    }
}

//
//
//
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
                
                // Initialize lazy loading after loading screen is hidden
                if (window.lazyImageLoader) {
                    window.lazyImageLoader.observeImages();
                }
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

// =========================
// IMPROVED MOBILE HAMBURGER MENU CONTROLLER
// =========================

class MobileMenuController {
    constructor() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.menuOverlay = document.getElementById('mobileMenuOverlay');
        this.isOpen = false;
        this.scrollPosition = 0; // Store scroll position
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.menuOverlay) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Add click event to hamburger button
        this.menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        // Add click event to overlay to close menu (but not the panel itself)
        this.menuOverlay.addEventListener('click', (e) => {
            // Only close if clicking the backdrop, not the panel content
            if (e.target === this.menuOverlay) {
                this.closeMenu();
            }
        });

        // Close menu when clicking on navigation links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            // Close mobile menu if resizing to desktop
            if (window.innerWidth > 900 && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        // Store current scroll position BEFORE opening menu
        this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        this.isOpen = true;
        this.menuToggle.classList.add('active');
        this.menuOverlay.classList.add('active');
        document.body.classList.add('mobile-menu-open');
        
        // Add accessibility
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.menuOverlay.setAttribute('aria-hidden', 'false');
    }

    closeMenu() {
        this.isOpen = false;
        this.menuToggle.classList.remove('active');
        this.menuOverlay.classList.remove('active');
        document.body.classList.remove('mobile-menu-open');
        
        // Restore scroll position AFTER closing menu
        setTimeout(() => {
            window.scrollTo(0, this.scrollPosition);
        }, 10);
        
        // Add accessibility
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuOverlay.setAttribute('aria-hidden', 'true');
    }
}

// =========================
// IMPROVED LANGUAGE TOGGLE ANIMATION
// =========================

class LanguageToggleAnimator {
    constructor() {
        this.languageToggle = document.getElementById('languageToggle');
        this.footer = document.querySelector('.footer');
        this.isAtBottom = false;
        this.isMobile = window.innerWidth <= 900;
        this.init();
    }

    init() {
        if (!this.languageToggle || !this.footer) {
            console.warn('Language toggle or footer not found');
            return;
        }

        // Don't add scroll animation on mobile
        if (!this.isMobile) {
            // Listen for scroll events with better throttling
            this.throttledScrollHandler = this.throttle(this.handleScroll.bind(this), 10);
            window.addEventListener('scroll', this.throttledScrollHandler, { passive: true });
            
            // Check initial position
            this.handleScroll();
        }

        // Listen for resize events to detect mobile/desktop changes
        window.addEventListener('resize', this.throttle(() => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (wasMobile !== this.isMobile) {
                if (this.isMobile) {
                    // Switched to mobile - remove animation
                    this.languageToggle.style.transform = 'none';
                    this.languageToggle.style.transition = 'none';
                    if (this.throttledScrollHandler) {
                        window.removeEventListener('scroll', this.throttledScrollHandler);
                    }
                } else {
                    // Switched to desktop - add animation back
                    this.throttledScrollHandler = this.throttle(this.handleScroll.bind(this), 10);
                    window.addEventListener('scroll', this.throttledScrollHandler, { passive: true });
                    this.handleScroll();
                }
            }
        }, 250));
    }

    handleScroll() {
        if (this.isMobile) return; // Skip on mobile

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );

        // Calculate exact distance from bottom
        const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
        
        // Only trigger when really at the bottom (within 50px of bottom)
        const shouldMoveUp = distanceFromBottom <= 50;

        // Only update if state changed to avoid unnecessary DOM manipulation
        if (shouldMoveUp !== this.isAtBottom) {
            this.isAtBottom = shouldMoveUp;
            this.updateButtonPosition();
        }
    }

    updateButtonPosition() {
        if (this.isMobile) return; // Skip on mobile

        if (this.isAtBottom) {
            // Move button up by 92px
            this.languageToggle.style.transform = 'translateY(-92px)';
            this.languageToggle.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            // Return to normal position
            this.languageToggle.style.transform = 'translateY(0)';
            this.languageToggle.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    }

    // Improved throttle function for smoother performance
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Cleanup method
    destroy() {
        if (this.throttledScrollHandler) {
            window.removeEventListener('scroll', this.throttledScrollHandler);
        }
    }
}

// =========================
// LANGUAGE TRANSLATIONS
// =========================

const translations = {
    en: {
        // Navigation
        'about': 'About me',
        'contact': 'Contact',
        'dataProtection': 'Data protection',
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
        'projects': 'PROJECTS',
        'projectsDescription': 'This is where I showcase a selection of 3D renders I created during my studies and for freelance projects. Each piece reflects my passion for visual storytelling, technical growth, and creative exploration in the world of digital design.',
        
        // Student work
        'studentWork': 'Student Work',
        'moreVideos': 'More Videos',
        'hideVideos': 'Hide Videos',
        'playVideo': 'Play Video',
        'previous': 'Previous',
        'next': 'Next',
        'videoGallery': 'Video Gallery',
        
        // Skills
        'softwareSkills': 'Software Skills',
        
        // About page
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
        
        // Data Protection page
        'dataProtectionTitle': 'Data Protection',
        'dataProtectionHeading': 'Data Protection',
        'lastUpdated': 'As a freelance 3D and VFX artist',
        'dataProtectionIntro': 'As a freelance 3D and VFX artist, I treat all client data, project files, and creative materials with the highest level of confidentiality and care. I understand that many projects involve sensitive content, proprietary designs, or unreleased visual material. Any information, files, or communication shared with me will not be passed on to third parties and will only be used for the purposes of the agreed project. All data is stored securely and handled in accordance with current data protection regulations (such as the GDPR, where applicable). If you have any questions about how your data is handled, or if you require a confidentiality agreement (NDA), feel free to reach out.',
        'ownershipTitle': 'Ownership of Original Work',
        'ownershipText': 'All original content that I create — including 3D models, textures, animations, simulations, compositing work, and renders — is, by default, protected under copyright law. As the creator, I hold the original intellectual property rights to these works unless explicitly transferred through a written agreement. Clients purchasing services from me typically receive a license to use the final deliverables for the agreed-upon purposes (e.g., marketing, games, film, etc.). The scope of this license — whether it\'s exclusive or non-exclusive, limited by time, geography, or usage — will be clearly defined in our agreement.',
        'transferTitle': 'Transfer of Rights',
        'transferText': 'If full ownership or exclusive rights are required, this must be stated in writing and may involve an additional fee, depending on the scope and intended use. I\'m always open to discussing custom licensing options that suit your project needs.',
        'thirdPartyTitle': 'Use of Third-Party Assets',
        'thirdPartyText': 'In some cases, projects may incorporate third-party assets (e.g., stock models, textures, plugins, sound effects). When this occurs: I ensure that all third-party content used is properly licensed for commercial use. I retain documentation of all licenses to protect both myself and my clients. If a client provides third-party assets, I assume they have the right to use and share them. It is the client\'s responsibility to ensure legal clearance for such materials.',
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
        'privacy': 'Data protection',
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
        'previous': 'Letztes',
        'next': 'Nächstes',
        'videoGallery': 'Video Galerie',
        
        // Skills
        'softwareSkills': 'Software-Kenntnisse',
        
        // About page
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
        
        // Data Protection page
        'dataProtectionTitle': 'Datenschutz',
        'dataProtectionHeading': 'Datenschutz',
        'lastUpdated': 'Als freiberuflicher 3D- und VFX-Künstler',
        'dataProtectionIntro': 'Als freiberuflicher 3D- und VFX-Künstler behandle ich alle Kundendaten, Projektdateien und kreativen Materialien mit höchster Vertraulichkeit und Sorgfalt. Ich verstehe, dass viele Projekte sensible Inhalte, proprietäre Designs oder unveröffentlichte visuelle Materialien beinhalten. Alle Informationen, Dateien oder Kommunikation, die mit mir geteilt werden, werden nicht an Dritte weitergegeben und nur für die Zwecke des vereinbarten Projekts verwendet. Alle Daten werden sicher gespeichert und in Übereinstimmung mit den aktuellen Datenschutzbestimmungen (wie der DSGVO, wo anwendbar) behandelt. Wenn Sie Fragen zum Umgang mit Ihren Daten haben oder eine Vertraulichkeitsvereinbarung (NDA) benötigen, können Sie sich gerne an mich wenden.',
        'ownershipTitle': 'Eigentum an Originalarbeiten',
        'ownershipText': 'Alle ursprünglichen Inhalte, die ich erstelle — einschließlich 3D-Modelle, Texturen, Animationen, Simulationen, Compositing-Arbeiten und Renderings — sind standardmäßig durch das Urheberrecht geschützt. Als Schöpfer halte ich die ursprünglichen Rechte am geistigen Eigentum an diesen Arbeiten, es sei denn, sie werden ausdrücklich durch eine schriftliche Vereinbarung übertragen. Kunden, die Dienstleistungen von mir erwerben, erhalten typischerweise eine Lizenz zur Nutzung der finalen Ergebnisse für die vereinbarten Zwecke (z.B. Marketing, Spiele, Film, etc.). Der Umfang dieser Lizenz — ob exklusiv oder nicht-exklusiv, zeitlich, geografisch oder nach Nutzung begrenzt — wird in unserer Vereinbarung klar definiert.',
        'transferTitle': 'Übertragung von Rechten',
        'transferText': 'Wenn vollständiges Eigentum oder exklusive Rechte erforderlich sind, muss dies schriftlich festgehalten werden und kann je nach Umfang und beabsichtigter Nutzung eine zusätzliche Gebühr beinhalten. Ich bin immer offen für Gespräche über maßgeschneiderte Lizenzoptionen, die Ihren Projektanforderungen entsprechen.',
        'thirdPartyTitle': 'Verwendung von Drittanbieter-Assets',
        'thirdPartyText': 'In einigen Fällen können Projekte Drittanbieter-Assets (z.B. Stock-Modelle, Texturen, Plugins, Soundeffekte) enthalten. Wenn dies der Fall ist: Ich stelle sicher, dass alle verwendeten Drittanbieter-Inhalte ordnungsgemäß für den kommerziellen Gebrauch lizenziert sind. Ich bewahre Dokumentationen aller Lizenzen auf, um sowohl mich als auch meine Kunden zu schützen. Wenn ein Kunde Drittanbieter-Assets bereitstellt, gehe ich davon aus, dass er das Recht hat, sie zu verwenden und zu teilen. Es liegt in der Verantwortung des Kunden, die rechtliche Freigabe für solche Materialien sicherzustellen.',
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
        'contentLiabilityText': 'Die Inhalte dieser Webseite wurden mit größter Sorgfalt erstellt. Als privater Seitenbetreiber bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte verantwortlich. Ich bin jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen (§§ 8–10 TMG).',
        'linksLiabilityTitle': 'Haftung für Links',
        'linksLiabilityText': 'Diese Webseite kann Links zu externen Webseiten enthalten. Für deren Inhalte übernehme ich keine Verantwortung. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar.',
        'copyrightTitle': 'Urheberrecht',
        'copyrightText': 'Alle auf dieser Webseite veröffentlichten Inhalte (z. B. Texte, Bilder, Videos) unterliegen dem deutschen Urheberrecht. Eine Verwendung außerhalb dieser Webseite ist nur mit ausdrücklicher Erlaubnis des Urhebers erlaubt.',
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

// =========================
// ENHANCED STUDENT WORK VIDEO FUNCTIONALITY
// =========================

// Video data with enhanced information
const videos = [
    { 
        id: 'productiontraining500', 
        title: 'Production Training 500', 
        url: './videos/ProductionTraining500.mov',
        image: './Images/ProductionTraining500.png',
        category: 'Aimation and Enviroment',
        duration: '1:12'
    },
    { 
        id: 'productiontraining400', 
        title: 'Production Training 400', 
        url: './videos/ProductionTraining400.mov',
        image: './Images/ProductionTraining400.png',
        category: 'Modelling and Texturing',
        duration: '0:45'
    },
    { 
        id: 'comp400', 
        title: 'Comp 400', 
        url: './videos/Comp400.mov',
        image: './Images/Comp400.png',
        category: 'CG Integration',
        duration: '0:15'
    },
    { 
        id: 'midterm400', 
        title: 'Midterm 400', 
        url: './videos/Midterm400.mp4',
        image: './Images/Midterm400.png',
        category: 'FX Simulation',
        duration: '0:37'
    },
    { 
        id: 'comp300', 
        title: 'Comp 300', 
        url: './videos/Comp300.mov',
        image: './Images/Comp300.png',
        category: 'CG Integration',
        duration: '0:09'
    },
    { 
        id: 'endterm300', 
        title: 'Endterm 300', 
        url: './videos/Endterm300.mov',
        image: './Images/Endterm300.png',
        category: 'Modeling',
        duration: '0:40'
    },
    { 
        id: 'midterm300', 
        title: 'Midterm 300', 
        url: './videos/Midterm300.mov',
        image: './Images/Midterm300.png',
        category: 'Aimation and Enviroment',
        duration: '0:59'
    },
    { 
        id: 'midterm200', 
        title: 'Midterm 200', 
        url: './videos/Midterm200.mp4',
        image: './Images/Midterm200.png',
        category: 'Aimation and Enviroment',
        duration: '1:13'
    }
];

let currentVideoIndex = 0;
let isGalleryOpen = false;

// Enhanced video gallery functions
function toggleVideoGallery() {
    const gallery = document.getElementById('videoGallery');
    const arrow = document.getElementById('moreVideosArrow');
    const text = document.getElementById('moreVideosText');
    
    if (!gallery || !arrow || !text) return;
    
    isGalleryOpen = !isGalleryOpen;
    
    if (isGalleryOpen) {
        // Open gallery
        gallery.style.display = 'block';
        setTimeout(() => {
            gallery.classList.add('show');
            
            // Lazy load gallery video thumbnails
            if (window.lazyImageLoader) {
                const galleryImages = gallery.querySelectorAll('.lazy-load');
                window.lazyImageLoader.addNewImages(galleryImages);
            }
        }, 10);
        arrow.classList.add('rotated');
        text.setAttribute('data-translate', 'hideVideos');
    } else {
        // Close gallery
        gallery.classList.remove('show');
        setTimeout(() => {
            gallery.style.display = 'none';
        }, 500);
        arrow.classList.remove('rotated');
        text.setAttribute('data-translate', 'moreVideos');
    }
    
    updateLanguage(); // Update text based on current language
}

// Enhanced video navigation
function navigateVideo(direction) {
    const newIndex = currentVideoIndex + direction;
    
    if (newIndex >= 0 && newIndex < videos.length) {
        currentVideoIndex = newIndex;
        selectVideoByIndex(currentVideoIndex);
        updateVideoControls();
    }
}

function selectVideoByIndex(index) {
    if (index < 0 || index >= videos.length) return;
    
    const video = videos[index];
    selectVideo(video.id, video.title, index);
}

function selectVideo(videoId, title, index = null) {
    // Find index if not provided
    if (index === null) {
        index = videos.findIndex(v => v.id === videoId);
    }
    
    if (index !== -1) {
        currentVideoIndex = index;
    }
    
    // Update active thumbnail
    document.querySelectorAll('.video-thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    
    const activeThumb = document.querySelector(`[data-video="${videoId}"]`);
    if (activeThumb) {
        activeThumb.classList.add('active');
    }
    
    // Update main video title
    const titleElement = document.getElementById('currentVideoTitle');
    if (titleElement) {
        titleElement.textContent = title;
    }
    
    // Find the video data
    const video = videos.find(v => v.id === videoId);
    
    // Reset video container with new preview image and overlay
    const videoContainer = document.getElementById('videoContainer');
    if (videoContainer && video) {
        videoContainer.innerHTML = `
            <div class="video-loading-overlay" id="videoLoadingOverlay" style="display: none;">
                <div class="video-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <p>Loading Video...</p>
            </div>
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMmMyYzJjIi8+Cjwvc3ZnPgo=" 
                 data-src="${video.image}" 
                 alt="${title}" 
                 class="main-video-preview lazy-load" 
                 id="mainVideoPreview"
                 loading="lazy">
            <div class="main-video-overlay"></div>
            <button class="play-video-btn" onclick="loadSelectedVideo('${videoId}')" id="playVideoBtn">
                <span class="play-icon">▶</span>
                <span class="play-text" data-translate="playVideo">Play Video</span>
            </button>
        `;
        
        // Initialize lazy loading for the new image
        if (window.lazyImageLoader) {
            const newImage = videoContainer.querySelector('.lazy-load');
            window.lazyImageLoader.addNewImages([newImage]);
        }
        
        // Update translation for play button
        updateLanguage();
    }
    
    updateVideoControls();
}

function updateVideoControls() {
    // Update counter
    const currentIndexElement = document.getElementById('currentVideoIndex');
    const totalVideosElement = document.getElementById('totalVideos');
    
    if (currentIndexElement) {
        currentIndexElement.textContent = currentVideoIndex + 1;
    }
    if (totalVideosElement) {
        totalVideosElement.textContent = videos.length;
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentVideoIndex === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentVideoIndex === videos.length - 1;
    }
}

// Enhanced video loading function
function loadVideo() {
    const currentVideo = videos[currentVideoIndex];
    if (currentVideo) {
        loadSelectedVideo(currentVideo.id);
    }
}

function loadSelectedVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    const videoContainer = document.getElementById('videoContainer');
    const loadingOverlay = document.getElementById('videoLoadingOverlay');
    
    if (!video || !videoContainer || !loadingOverlay) {
        console.error('Video not found or container missing:', videoId);
        return;
    }
    
    // Show loading animation
    loadingOverlay.style.display = 'flex';
    
    // Create video element and monitor actual loading
    const videoElement = document.createElement('video');
    videoElement.className = 'video-embed';
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.playsInline = true; // Better mobile support
    
    // Add sources for better compatibility
    const mp4Source = document.createElement('source');
    mp4Source.src = video.url;
    mp4Source.type = 'video/mp4';
    
    const movSource = document.createElement('source');
    movSource.src = video.url;
    movSource.type = 'video/quicktime';
    
    videoElement.appendChild(mp4Source);
    videoElement.appendChild(movSource);
    
    // Handle actual loading events
    videoElement.addEventListener('loadstart', () => {
        console.log(`Video loading started: ${video.title}`);
    });
    
    videoElement.addEventListener('canplay', () => {
        console.log(`Video ready to play: ${video.title}`);
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            videoContainer.innerHTML = '';
            videoContainer.appendChild(videoElement);
        }, 200);
    });
    
    videoElement.addEventListener('error', (e) => {
        console.error(`Video failed to load: ${video.title}`, e);
        loadingOverlay.style.display = 'none';
        videoContainer.innerHTML = `
            <div class="video-error" style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ff6b6b; text-align: center; background: #2c2c2c; border-radius: 16px;">
                <div>
                    <p>❌ Video nicht gefunden: ${video.url}</p>
                    <p>Bitte prüfen Sie, dass das Video im './videos/' Ordner ist</p>
                    <button onclick="selectVideoByIndex(${currentVideoIndex})" style="margin-top: 15px; padding: 10px 20px; background: #4ade80; color: #000; border: none; border-radius: 5px; cursor: pointer;">
                        Zurück zum Vorschaubild
                    </button>
                </div>
            </div>
        `;
    });
    
    // Start loading the video
    videoElement.load();
}

// Touch/Swipe support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

function initializeTouchSupport() {
    const videoContainer = document.getElementById('videoContainer');
    
    if (videoContainer) {
        videoContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        videoContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next video
            navigateVideo(1);
        } else {
            // Swipe right - previous video
            navigateVideo(-1);
        }
    }
}

// Keyboard navigation support
function initializeKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
        // Only handle keys when not typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                navigateVideo(-1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                navigateVideo(1);
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                if (!isGalleryOpen) {
                    loadVideo();
                }
                break;
            case 'Escape':
                if (isGalleryOpen) {
                    toggleVideoGallery();
                }
                break;
        }
    });
}

// =========================
// ENHANCED RIPPLE EFFECTS
// =========================

// Add enhanced ripple effect to buttons
function addRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const originalSize = Math.max(rect.width, rect.height);
    const size = originalSize * 0.15;
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

// Helper function to get translated text
function getTranslatedText(key, replacements = {}) {
    let text = translations[currentLanguage][key] || key;
    
    // Replace placeholders like {name}, {email}, etc.
    Object.keys(replacements).forEach(placeholder => {
        text = text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
    });
    
    return text;
}

// EmailJS Configuration
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_604p3x6',
    TEMPLATE_ID: 'template_o3ugp57',
    PUBLIC_KEY: 'V_GdklqrG-dfyXQ3M'
};

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Enhanced VFX Portfolio website loaded successfully!');
    
    // Initialize lazy loading first
    window.lazyImageLoader = new LazyImageLoader();
    
    // Initialize FIXED responsive image switcher
    window.imageSwitcher = new ResponsiveImageSwitcher();
    
    // Initialize loading controller
    new LoadingController();
    
    // Initialize IMPROVED mobile menu controller
    new MobileMenuController();
    
    // Initialize improved scroll animation for language toggle
    new LanguageToggleAnimator();
    
    // Initialize language on page load
    addTranslationAttributes();
    updateLanguage();
    
    // Initialize enhanced video functionality
    updateVideoControls();
    initializeTouchSupport();
    initializeKeyboardSupport();
    
    // Add ripple effects to interactive elements
    const rippleElements = document.querySelectorAll('.skill-btn, .submit-btn, .more-videos-btn, .read-more-btn, .play-video-btn, .control-btn, .lang-btn');
    rippleElements.forEach(element => {
        element.addEventListener('click', addRippleEffect);
    });
    
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

    // Add click events to video thumbnails with lazy loading support
    document.querySelectorAll('.video-thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video');
            const title = this.getAttribute('data-title');
            const index = parseInt(this.getAttribute('data-index'));
            selectVideo(videoId, title, index);
        });
    });

    // Initialize contact form if it exists
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
    }
    
    console.log('🚀 Lazy Loading: System initialized');
    console.log('🖼️ FIXED iPad-Orientierung: Hochkant = StartScene.png, Querformat = DesktopTumbnail.png');
    console.log('🎬 Enhanced Student Work video system initialized');
    console.log(`📹 ${videos.length} videos loaded`);
    console.log('👆 Touch/swipe navigation enabled');
    console.log('⌨️  Keyboard navigation enabled (←/→ for navigation, Space/Enter to play, Esc to close gallery)');
    console.log('🍔 IMPROVED Mobile hamburger menu initialized');
});

// Contact form submission handler
async function handleContactFormSubmission(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const messageArea = document.getElementById('messageArea');
    
    // Get form data and map to EmailJS template variables
    const formData = new FormData(e.target);
    const templateParams = {
        time: new Date().toLocaleString('de-DE'),
        vorname: formData.get('vorname'),
        nachname: formData.get('nachname'),
        Email: formData.get('email'),
        message: formData.get('nachricht'),
        // Additional params for success message display
        name: `${formData.get('vorname')} ${formData.get('nachname')}`,
        from_email: formData.get('email'),
        subjekt: formData.get('betreff') || 'Contact from Portfolio',
        to_email: 'moritzpahrmann6@gmail.com'
    };
    
    // Basic validation with translated messages
    if (!formData.get('vorname') || !formData.get('nachname') || !formData.get('email') || !formData.get('nachricht')) {
        showMessage(getTranslatedText('emailValidationRequired'), 'error');
        return;
    }
    
    // Email validation with translated message
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.get('email'))) {
        showMessage(getTranslatedText('emailValidationInvalid'), 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline';
    
    try {
        // Check if emailjs is loaded
        if (typeof window.emailjs === 'undefined') {
            throw new Error('EmailJS not loaded');
        }
        
        // Send email using EmailJS with your template
        const result = await window.emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        console.log('Email sent successfully:', result);
        
        // Show success message with translated text and replacements
        const successMessage = getTranslatedText('emailSuccess', {
            name: templateParams.name,
            email: templateParams.from_email,
            subject: templateParams.subjekt,
            time: templateParams.time
        });
        
        showMessage(successMessage, 'success');
        e.target.reset();
        
    } catch (error) {
        console.error('Email sending failed:', error);
        showMessage(getTranslatedText('emailError'), 'error');
    } finally {
        resetButton();
    }
    
    function resetButton() {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnSpinner.style.display = 'none';
    }
}

// Show form messages with smooth animation
function showMessage(message, type) {
    const messageArea = document.getElementById('messageArea');
    const contactForm = document.querySelector('.contact-form');
    
    if (!messageArea || !contactForm) return;
    
    // Add the message with smooth fade-in
    messageArea.innerHTML = `
        <div class="form-message ${type}" style="opacity: 0; transform: translateY(-10px); transition: all 0.3s ease;">
            ${message.replace(/\n/g, '<br>')}
        </div>
    `;
    
    // Add class to form to create space for message
    contactForm.classList.add('with-message');
    
    // Fade in the message after a short delay
    setTimeout(() => {
        const messageDiv = messageArea.querySelector('.form-message');
        if (messageDiv) {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }
    }, 100);
    
    // Auto-hide success messages after 8 seconds
    if (type === 'success') {
        setTimeout(() => {
            hideMessage();
        }, 8000);
    }
    
    // Scroll to message smoothly
    messageArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Hide message with smooth animation
function hideMessage() {
    const messageArea = document.getElementById('messageArea');
    const contactForm = document.querySelector('.contact-form');
    const messageDiv = messageArea?.querySelector('.form-message');
    
    if (messageDiv) {
        // Fade out message
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(-10px)';
        
        // Remove form spacing after message fades out
        setTimeout(() => {
            if (contactForm) contactForm.classList.remove('with-message');
            if (messageArea) messageArea.innerHTML = '';
        }, 300);
    }
}