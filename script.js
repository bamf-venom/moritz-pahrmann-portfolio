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
// PROJECT POPUP MODAL FUNCTIONALITY
// =========================

class ProjectModal {
    constructor() {
        this.modal = document.getElementById('projectModal');
        this.backdrop = document.getElementById('projectModalBackdrop');
        this.closeBtn = document.getElementById('projectModalClose');
        this.isOpen = false;
        this.currentProjectId = null;
        this.currentMediaIndex = 0;
        this.scrollPosition = 0;
        
        // Project data - this would normally come from a database
        this.projectData = {
            '1': {
                title: 'Advanced Environment Design',
                category: '3D Animation',
                description: 'This project showcases advanced environment modeling and lighting techniques. I created a photorealistic outdoor scene using Maya and Arnold renderer, focusing on natural lighting and atmospheric effects. The project demonstrates my skills in creating immersive 3D environments that could be used in films, games, or architectural visualization.',
                software: 'Maya, Arnold, Nuke, Photoshop',
                duration: '3 weeks',
                year: '2024',
                tags: ['Environment', 'Lighting', '3D Modeling', 'Arnold', 'Compositing'],
                media: [
                    { type: 'image', src: './Images/Projekts/Projekt_01/Projekt_01.PNG', thumbnail: './Images/Projekts/Projekt_01/ThumbnailCard.png', alt: 'Projekt 1 - Hauptbild' },
                    { type: 'image', src: './Images/Projekts/Projekt_01/Projekt_01.PNG', thumbnail: './Images/Projekts/Projekt_01/ThumbnailCard.png', alt: 'Projekt 1 - Thumbnail' }
                ]
            },
            '2': {
                title: 'Character VFX Integration',
                category: 'VFX Design',
                description: 'A complex VFX project involving character integration into live-action footage. This work demonstrates my compositing skills and understanding of visual effects workflows. I used advanced rotoscoping, color grading, and particle effects to seamlessly integrate 3D elements with real footage.',
                software: 'Nuke, Maya, Houdini, After Effects',
                duration: '4 weeks',
                year: '2024',
                tags: ['VFX', 'Compositing', 'Character Work', 'Live Action', 'Particles'],
                media: [
                    { type: 'image', src: './Images/Projekts/Projekt_02/Projekt_02.PNG', thumbnail: './Images/Projekts/Projekt_02/ThumbnailCard.png', alt: 'Projekt 2 - Hauptbild' },
                    { type: 'image', src: './Images/Projekts/Projekt_02/Projekt_02.PNG', thumbnail: './Images/Projekts/Projekt_02/ThumbnailCard.png', alt: 'Projekt 2 - Thumbnail' }
                ]
            },
            '3': {
                title: 'Motion Graphics Sequence',
                category: 'Motion Graphics',
                description: 'Dynamic motion graphics project created for a fictional tech company. This project showcases my ability to create engaging animated content that combines typography, 3D elements, and visual effects. The animation was designed to be both informative and visually striking.',
                software: 'After Effects, Cinema 4D, Illustrator',
                duration: '2 weeks',
                year: '2024',
                tags: ['Motion Graphics', 'Typography', 'Branding', '3D', 'Animation'],
                media: [
                    { type: 'image', src: './Images/Projekts/Projekt_03/Projekt_03.PNG', thumbnail: './Images/Projekts/Projekt_03/ThumbnailCard.png', alt: 'Projekt 3 - Hauptbild' },
                    { type: 'image', src: './Images/Projekts/Projekt_03/Projekt_03.PNG', thumbnail: './Images/Projekts/Projekt_03/ThumbnailCard.png', alt: 'Projekt 3 - Thumbnail' }
                ]
            },
            '4': {
                title: 'Photorealistic Product Render',
                category: '3D Rendering',
                description: 'High-end product visualization project demonstrating advanced materials, lighting, and rendering techniques. This project focuses on creating photorealistic images that could be used for commercial purposes. Every detail was carefully crafted to achieve maximum realism.',
                software: 'Maya, Arnold, Substance Painter',
                duration: '2 weeks',
                year: '2024',
                tags: ['Product Viz', 'Photorealistic', 'Materials', 'Lighting', 'Commercial'],
                media: [
                    { type: 'image', src: './Images/Projekts/Projekt_04/Projekt_04.PNG', thumbnail: './Images/Projekts/Projekt_04/ThumbnailCard.png', alt: 'Projekt 4 - Hauptbild' },
                    { type: 'image', src: './Images/Projekts/Projekt_04/Projekt_04.PNG', thumbnail: './Images/Projekts/Projekt_04/ThumbnailCard.png', alt: 'Projekt 4 - Thumbnail' }
                ]
            },
            '5': {
                title: 'Stylized Character Design',
                category: 'Character Design',
                description: 'Original character design project showcasing stylized 3D modeling and texturing skills. This character was designed for a fictional animated series, combining appealing design with technical excellence. The project includes full character modeling, texturing, and basic rigging.',
                software: 'ZBrush, Maya, Substance Painter',
                duration: '5 weeks',
                year: '2024',
                tags: ['Character', 'Stylized', 'ZBrush', 'Sculpting', 'Texturing'],
                media: [
                    { type: 'image', src: './Images/Projekts/Projekt_05/Projekt_05.PNG', thumbnail: './Images/Projekts/Projekt_05/ThumbnailCard.png', alt: 'Projekt 5 - Hauptbild' },
                    { type: 'image', src: './Images/Projekts/Projekt_05/Projekt_05.PNG', thumbnail: './Images/Projekts/Projekt_05/ThumbnailCard.png', alt: 'Projekt 5 - Thumbnail' }
                ]
            },
            '6': {
                title: 'Epic Environment Scene',
                category: 'Environment Art',
                description: 'Large-scale environment project inspired by fantasy landscapes. This project demonstrates my ability to create expansive, detailed environments suitable for games or films. The scene includes complex terrain modeling, vegetation systems, and atmospheric lighting.',
                software: 'Maya, Unreal Engine, World Creator',
                duration: '6 weeks',
                year: '2024',
                tags: ['Environment', 'Fantasy', 'Unreal', 'Landscape', 'Atmosphere'],
                media: [
                    { type: 'image', src: './Images/Projekts/Projekt_06/Projekt_06.PNG', thumbnail: './Images/Projekts/Projekt_06/ThumbnailCard.png', alt: 'Projekt 6 - Hauptbild' },
                    { type: 'image', src: './Images/Projekts/Projekt_06/Projekt_06.PNG', thumbnail: './Images/Projekts/Projekt_06/ThumbnailCard.png', alt: 'Projekt 6 - Thumbnail' }
                ]
            }
        };
        
        this.init();
    }
    
    init() {
        // Add click listeners to all project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = card.getAttribute('data-project-id');
                if (projectId && this.projectData[projectId]) {
                    this.openModal(projectId);
                }
            });
        });
        
        // Add close button listener
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Add backdrop click listener
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.closeModal());
        }
        
        // Add keyboard listener
        document.addEventListener('keydown', (e) => {
            if (this.isOpen) {
                switch(e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowLeft':
                        this.previousMedia();
                        break;
                    case 'ArrowRight':
                        this.nextMedia();
                        break;
                }
            }
        });
        
        console.log('🎨 Project Modal initialized');
    }
    
    openModal(projectId) {
        const project = this.projectData[projectId];
        if (!project) return;
        
        this.currentProjectId = projectId;
        this.currentMediaIndex = 0;
        this.scrollPosition = window.pageYOffset;
        
        // Clear any lingering styles before opening
        document.body.style.cursor = '';
        document.documentElement.style.cursor = '';
        
        // Populate modal content
        this.populateModal(project);
        
        // Show modal
        this.isOpen = true;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // FIXED: Apply language translations after populating modal
        updateLanguage();
        
        console.log(`🖼️ Opening project modal: ${project.title}`);
    }
    
    closeModal() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.modal.classList.remove('active');
        
        // IMPROVED: Comprehensive cleanup and event handler restoration
        document.body.style.overflow = '';
        document.body.style.cursor = '';
        document.documentElement.style.cursor = '';
        
        // Immediately re-enable pointer events
        document.body.style.pointerEvents = '';
        document.documentElement.style.pointerEvents = '';
        
        // Force removal of any remaining modal-related styles
        this.modal.style.pointerEvents = '';
        
        // Force re-activation of project cards immediately
        setTimeout(() => {
            // Re-enable all project cards
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                card.style.pointerEvents = '';
                card.style.cursor = 'pointer';
                
                // Force a reflow to ensure styles are applied
                card.offsetHeight;
            });
            
            // Trigger multiple synthetic events for better compatibility
            const mouseEvents = ['mousemove', 'mouseenter', 'mouseover'];
            mouseEvents.forEach(eventType => {
                const syntheticEvent = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: 0,
                    clientY: 0
                });
                document.dispatchEvent(syntheticEvent);
            });
            
            // Force focus reset
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
            
            console.log('🔄 Event handlers and interactions restored');
        }, 50); // Reduced timeout for faster response
        
        window.scrollTo(0, this.scrollPosition);
        
        // Clean up video if playing
        const mainImage = document.getElementById('projectModalMainImage');
        if (mainImage && mainImage.tagName === 'VIDEO') {
            mainImage.pause();
        }
        
        console.log('🚪 Closing project modal');
    }
    
    populateModal(project) {
        // Update title
        const title = document.getElementById('projectModalTitle');
        if (title) title.textContent = project.title;
        
        // Update category  
        const category = document.getElementById('projectModalCategory');
        if (category) category.textContent = project.category;
        
        // Update description
        const description = document.getElementById('projectModalDescription');
        if (description) description.textContent = project.description;
        
        // Update details
        const software = document.getElementById('projectModalSoftware');
        if (software) software.textContent = project.software;
        
        const duration = document.getElementById('projectModalDuration');
        if (duration) duration.textContent = project.duration;
        
        const year = document.getElementById('projectModalYear');
        if (year) year.textContent = project.year;
        
        // Update tags
        const tagsContainer = document.getElementById('projectModalTags');
        if (tagsContainer) {
            tagsContainer.innerHTML = '';
            project.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'project-tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        }
        
        // Setup media
        this.setupMedia(project.media);
    }
    
    setupMedia(media) {
        // Setup gallery with all media items
        this.setupGallery(media);
        
        // Setup main media display
        this.showMedia(media[0]);
        
        // Setup thumbnails
        const thumbnailsContainer = document.getElementById('projectModalThumbnails');
        if (thumbnailsContainer) {
            thumbnailsContainer.innerHTML = '';
            
            media.forEach((item, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'project-modal-thumbnail';
                if (index === 0) thumbnail.classList.add('active');
                
                const img = document.createElement('img');
                img.src = item.thumbnail;
                img.alt = item.alt || `Media ${index + 1}`;
                
                thumbnail.appendChild(img);
                
                // Add video indicator if it's a video
                if (item.type === 'video') {
                    const indicator = document.createElement('div');
                    indicator.className = 'video-indicator';
                    indicator.innerHTML = '▶';
                    thumbnail.appendChild(indicator);
                }
                
                thumbnail.addEventListener('click', () => {
                    this.currentMediaIndex = index;
                    this.showMedia(item);
                    this.updateThumbnailActive();
                });
                
                thumbnailsContainer.appendChild(thumbnail);
            });
        }
    }
    
    setupGallery(media) {
        // Setup scrollable gallery display with project images
        const galleryContainer = document.getElementById('projectModalGallery');
        if (galleryContainer) {
            galleryContainer.innerHTML = '';
            
            media.forEach((item, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                if (item.type === 'video') {
                    const video = document.createElement('video');
                    video.poster = item.thumbnail;
                    const source = document.createElement('source');
                    source.src = item.src;
                    source.type = 'video/mp4';
                    video.appendChild(source);
                    
                    const overlay = document.createElement('div');
                    overlay.className = 'gallery-item-overlay';
                    const playButton = document.createElement('div');
                    playButton.className = 'gallery-play-button';
                    playButton.textContent = '▶';
                    overlay.appendChild(playButton);
                    
                    galleryItem.appendChild(video);
                    galleryItem.appendChild(overlay);
                } else {
                    const img = document.createElement('img');
                    img.src = item.src;
                    img.alt = item.alt || `Project Image ${index + 1}`;
                    img.loading = 'lazy';
                    galleryItem.appendChild(img);
                }
                
                // Add click listener for main display
                galleryItem.addEventListener('click', () => {
                    this.currentMediaIndex = index;
                    this.showMedia(item);
                    this.updateThumbnailActive();
                });
                
                galleryContainer.appendChild(galleryItem);
            });
        }
    }
    
    showMedia(mediaItem) {
        const mainImageContainer = document.querySelector('.project-modal-main-image');
        const playOverlay = document.getElementById('projectModalPlayOverlay');
        
        if (!mainImageContainer) return;
        
        // Clear previous content
        const existingMedia = mainImageContainer.querySelector('img, video');
        if (existingMedia) {
            existingMedia.remove();
        }
        
        if (mediaItem.type === 'video') {
            // Show image placeholder with play overlay
            const img = document.createElement('img');
            img.id = 'projectModalMainImage';
            img.src = mediaItem.src; // Using placeholder for demo
            img.alt = 'Video thumbnail';
            
            mainImageContainer.appendChild(img);
            
            if (playOverlay) {
                playOverlay.style.display = 'flex';
                playOverlay.onclick = () => this.playVideo(mediaItem);
            }
        } else {
            // Show image
            const img = document.createElement('img');
            img.id = 'projectModalMainImage';
            img.src = mediaItem.src;
            img.alt = 'Project image';
            
            mainImageContainer.appendChild(img);
            
            if (playOverlay) {
                playOverlay.style.display = 'none';
            }
        }
    }
    
    playVideo(mediaItem) {
        const mainImageContainer = document.querySelector('.project-modal-main-image');
        const playOverlay = document.getElementById('projectModalPlayOverlay');
        
        if (!mainImageContainer) return;
        
        // For demo purposes, we'll just show an alert
        // In a real implementation, you would create a video element
        alert(`Playing video: ${mediaItem.src}\n\n(This is a demo - video playback would be implemented here)`);
        
        // Example of how video implementation would work:
        /*
        const video = document.createElement('video');
        video.id = 'projectModalMainImage';
        video.src = mediaItem.src;
        video.controls = true;
        video.autoplay = true;
        
        const existingMedia = mainImageContainer.querySelector('img, video');
        if (existingMedia) {
            existingMedia.remove();
        }
        
        mainImageContainer.appendChild(video);
        if (playOverlay) playOverlay.style.display = 'none';
        */
    }
    
    updateThumbnailActive() {
        const thumbnails = document.querySelectorAll('.project-modal-thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === this.currentMediaIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }
    
    previousMedia() {
        const project = this.projectData[this.currentProjectId];
        if (!project) return;
        
        if (this.currentMediaIndex > 0) {
            this.currentMediaIndex--;
            this.showMedia(project.media[this.currentMediaIndex]);
            this.updateThumbnailActive();
        }
    }
    
    nextMedia() {
        const project = this.projectData[this.currentProjectId];
        if (!project) return;
        
        if (this.currentMediaIndex < project.media.length - 1) {
            this.currentMediaIndex++;
            this.showMedia(project.media[this.currentMediaIndex]);
            this.updateThumbnailActive();
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
        
        // Project cards - roles/categories
        'project1Role': '3D Animation',
        'project2Role': 'VFX Design',
        'project3Role': 'Motion Graphics',
        'project4Role': '3D Rendering',
        'project5Role': 'Character Design',
        'project6Role': 'Environment Art',
        
        // Project cards - descriptions
        'project1Description': 'Provisional subtitle for the first project with interesting details.',
        'project2Description': 'Provisional subtitle for the second project with creative elements.',
        'project3Description': 'Provisional subtitle for the third project with dynamic animations.',
        'project4Description': 'Provisional subtitle for the fourth project with photorealistic renderings.',
        'project5Description': 'Provisional subtitle for the fifth project with character design.',
        'project6Description': 'Provisional subtitle for the sixth project with environment design.',
        
        // Project modal
        'projectModalTitle': 'Project Title',
        'projectModalCategory': 'Category',
        'projectModalDescription': 'Project description goes here...',
        'projectModalSoftwareLabel': 'Software Used:',
        'projectModalSoftware': 'Maya, Arnold, Nuke',
        'projectModalDurationLabel': 'Duration:',
        'projectModalDuration': '2 weeks',
        'projectModalYearLabel': 'Year:',
        'projectModalYear': '2024',
        'projectModalLikeText': 'Like this project',
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
        'aboutIntro': "Hi! I'm Moritz, 20 years old, and currently studying 3D Visual Effects. Since April 2024, I've been part of the PIXL VISN Media Arts Academy, and it didn’t take long for me to realize that 3D isn’t just a subject for me – it’s a real passion.",
        'aboutText1': 'What excites me most about working in 3D is the variety. No two projects are the same, and I love taking on new creative and technical challenges. I really enjoy finding solutions, learning new things, and growing with every piece I create. From the first concept to the final render, I see every project as a chance to tell a story, express an idea, or bring an imagined world to life.',
        'aboutText2': 'My goal is to express my creativity through 3D visual effects – whether it’s environments, product visualizations, motion graphics, or something completely new. I am ays open to exciting projects, fresh perspectives, and creative collaboration. And I’m excited to keep evolving as an artist in this dynamic and ever-changing field.',
        'myCustomers': 'My Partners and Clients',
        'customersText1': 'Here you’ll find an overview of some of my valued collaborators and clients.',
        'customersText2': 'Every collaboration is a valuable experience for me as a 3D artist and helps me grow, in terms of my technical skills and my creative perspective.',
        'customersText3': 'I’m excited to take on new and inspiring projects in the future and to build new partnerships along the way.',
        
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
        
        // Project cards - roles/categories
        'project1Role': '3D Animation',
        'project2Role': 'VFX Design',
        'project3Role': 'Motion Graphics',
        'project4Role': '3D Rendering',
        'project5Role': 'Character Design',
        'project6Role': 'Environment Art',
        
        // Project cards - descriptions
        'project1Description': 'Provisorischer Untertitel für das erste Projekt mit interessanten Details.',
        'project2Description': 'Provisorischer Untertitel für das zweite Projekt mit kreativen Elementen.',
        'project3Description': 'Provisorischer Untertitel für das dritte Projekt mit dynamischen Animationen.',
        'project4Description': 'Provisorischer Untertitel für das vierte Projekt mit fotorealistischen Renderings.',
        'project5Description': 'Provisorischer Untertitel für das fünfte Projekt mit Charakterdesign.',
        'project6Description': 'Provisorischer Untertitel für das sechste Projekt mit Umgebungsgestaltung.',
        
        // Project modal
        'projectModalTitle': 'Projekt Titel',
        'projectModalCategory': 'Kategorie',
        'projectModalDescription': 'Projektbeschreibung folgt hier...',
        'projectModalSoftwareLabel': 'Verwendete Software:',
        'projectModalSoftware': 'Maya, Arnold, Nuke',
        'projectModalDurationLabel': 'Dauer:',
        'projectModalDuration': '2 Wochen',
        'projectModalYearLabel': 'Jahr:',
        'projectModalYear': '2024',
        'projectModalLikeText': 'Projekt liken',
        
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
        'aboutIntro': 'Hi! Ich bin Moritz 20 Jahre alt und studiere derzeit 3D Visual Effects Seit April 2024 bin ich Teil der PIXL VISN Media Artist Academy, wo mir schnell klar wurde, 3D ist nicht einfach nur ein Fachgebiet für mich es ist viel mehr meine Leidenschaft.',
        'aboutText1': 'Was mich an der Arbeit im 3D-Bereich besonders begeistert, ist die Vielfalt. Kein Projekt ist wie das andere, und ich liebe es, mich immer wieder neuen kreativen und technischen Herausforderungen zu stellen. Ich habe großen Spaß daran, Lösungen zu finden, Neues zu lernen und mich mit jedem Projekt weiterzuentwickeln. Vom ersten Konzept bis zum finalen Render sehe ich jede Arbeit als Chance, eine Geschichte zu erzählen, eine Idee auszudrücken oder eine ganz eigene Welt zum Leben zu erwecken.',
        'aboutText2': 'Mein Ziel ist es, meine Kreativität durch 3D Visual Effects auszuleben – egal ob in Umgebungen, Produktvisualisierungen, Motion Graphics oder ganz neuen Formaten. Ich bin immer offen für spannende Projekte, neue Perspektiven und kreative Zusammenarbeit. Und ich freue mich darauf, als Künstler in diesem dynamischen Feld weiter zu wachsen und mich ständig neu zu erfinden.',
        'myCustomers': 'Meine Patner und Kunden',
        'customersText1': 'Hier finden Sie eine Übersicht über einige meiner geschätzten Kooperationspartner und Kunden.',
        'customersText2': 'Jede Zusammenarbeit und Kooperation ist für michch als 3D-Artist eine wertvolle Erfahrung und hilft mir dabei, meine Fähigkeiten und meinen Blick auf kreative Prozesse weiterzuentwickeln. sowohl technisch als auch Kreativ.',
        'customersText3': 'Ich freue mich darauf, in Zukunft weitere spannende Projekte umzusetzen und neue Partnerschaften einzugehen.',
        
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
        url: './videos/Midterm400.mov',
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

// Enhanced video loading function with auto-play
function loadVideo() {
    const currentVideo = videos[currentVideoIndex];
    if (currentVideo) {
        loadSelectedVideo(currentVideo.id, true); // Pass true for auto-play
    }
}

// IMPROVED: Custom Video Player with better controls and auto-play support
function loadSelectedVideo(videoId, autoPlay = false) {
    const video = videos.find(v => v.id === videoId);
    const videoContainer = document.getElementById('videoContainer');
    const loadingOverlay = document.getElementById('videoLoadingOverlay');
    
    if (!video || !videoContainer || !loadingOverlay) {
        console.error('Video not found or container missing:', videoId);
        return;
    }
    
    // Show loading animation
    loadingOverlay.style.display = 'flex';
    
    // Create custom video player with enhanced controls
    const videoPlayerHTML = `
        <div class="custom-video-player" id="customVideoPlayer">
            <video 
                class="video-embed" 
                id="mainVideo"
                playsinline
                preload="metadata"
                poster="${video.image}"
            >
                <source src="${video.url}" type="video/mp4">
                <source src="${video.url}" type="video/quicktime">
                <p>Ihr Browser unterstützt das Video-Format nicht.</p>
            </video>
            
            <!-- Custom Video Controls -->
            <div class="custom-video-controls" id="videoControls">
                <div class="video-controls-overlay" id="controlsOverlay">
                    <!-- Progress Bar -->
                    <div class="video-progress-container" id="progressContainer">
                        <div class="video-progress-bar" id="progressBar">
                            <div class="video-progress-fill" id="progressFill"></div>
                            <div class="video-progress-handle" id="progressHandle"></div>
                        </div>
                        <div class="video-time-display">
                            <span id="currentTime">0:00</span>
                            <span id="totalTime">0:00</span>
                        </div>
                    </div>
                    
                    <!-- Control Buttons -->
                    <div class="video-control-buttons">
                        <button class="video-btn play-pause-btn" id="playPauseBtn">
                            <span class="play-icon">▶</span>
                            <span class="pause-icon" style="display: none;">⏸</span>
                        </button>
                        
                        <div class="video-volume-control">
                            <button class="video-btn volume-btn" id="volumeBtn">
                                <span class="volume-icon">🔊</span>
                            </button>
                            <div class="volume-slider-container">
                                <input type="range" class="volume-slider" id="volumeSlider" min="0" max="100" value="100">
                            </div>
                        </div>
                        
                        <div class="video-control-spacer"></div>
                        
                        <button class="video-btn fullscreen-btn" id="fullscreenBtn">
                            <span class="fullscreen-icon">⛶</span>
                        </button>
                    </div>
                </div>
                
                <!-- Center Play/Pause Button (shows when paused) -->
                <div class="center-play-button" id="centerPlayButton" style="display: none;"><button class="center-play-btn" id="centerPlayBtn">
                    <span class="center-play-icon">▶</span>
                </button>
            </div>
        </div>
    `;
    
    // Create video element and monitor loading
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    
    // Add sources for compatibility checking
    const mp4Source = document.createElement('source');
    mp4Source.src = video.url;
    mp4Source.type = 'video/mp4';
    
    const movSource = document.createElement('source');
    movSource.src = video.url;
    movSource.type = 'video/quicktime';
    
    tempVideo.appendChild(mp4Source);
    tempVideo.appendChild(movSource);
    
    // Handle loading events with auto-play
    tempVideo.addEventListener('loadedmetadata', () => {
        console.log(`Video metadata loaded: ${video.title}`);
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            videoContainer.innerHTML = videoPlayerHTML;
            initializeCustomVideoPlayer(video, autoPlay); // Pass autoPlay to initialization
        }, 200);
    });
    
    tempVideo.addEventListener('error', (e) => {
        console.error(`Video failed to load: ${video.title}`, e);
        loadingOverlay.style.display = 'none';
        videoContainer.innerHTML = `
            <div class="video-error" style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ff6b6b; text-align: center; background: #2c2c2c; border-radius: 16px;">
                <div>
                    <p>❌ Video nicht gefunden: ${video.url}</p>
                    <p>Bitte prüfen Sie, dass das Video im './videos/' Ordner ist</p>
                    <button onclick="selectVideoByIndex(${currentVideoIndex})" style="margin-top: 15px; padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Zurück zum Vorschaubild
                    </button>
                </div>
            </div>
        `;
    });
    
    // Start loading the video
    tempVideo.load();
}

// Initialize custom video player with enhanced controls and auto-play support
function initializeCustomVideoPlayer(videoData, autoPlay = false) {
    const video = document.getElementById('mainVideo');
    const playerContainer = document.getElementById('customVideoPlayer');
    const controlsOverlay = document.getElementById('controlsOverlay');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const centerPlayButton = document.getElementById('centerPlayButton');
    const centerPlayBtn = document.getElementById('centerPlayBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const progressHandle = document.getElementById('progressHandle');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    if (!video || !playerContainer) return;
    
    let isPlaying = false;
    let isDragging = false;
    let hideControlsTimeout;
    
    // Format time function
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Update progress bar
    function updateProgress() {
        if (!isDragging && video.duration) {
            const progress = (video.currentTime / video.duration) * 100;
            progressFill.style.width = progress + '%';
            progressHandle.style.left = progress + '%';
            currentTimeEl.textContent = formatTime(video.currentTime);
        }
    }
    
    // Show/hide controls
    function showControls() {
        controlsOverlay.style.opacity = '1';
        controlsOverlay.style.pointerEvents = 'all';
        playerContainer.style.cursor = 'default';
        
        clearTimeout(hideControlsTimeout);
        if (isPlaying) {
            hideControlsTimeout = setTimeout(hideControls, 3000);
        }
    }
    
    function hideControls() {
        if (!isDragging) {
            controlsOverlay.style.opacity = '0';
            controlsOverlay.style.pointerEvents = 'none';
            playerContainer.style.cursor = 'none';
        }
    }
    
    // Play/Pause functionality with center button
    function togglePlayPause() {
        if (video.paused) {
            video.play();
            isPlaying = true;
            playPauseBtn.querySelector('.play-icon').style.display = 'none';
            playPauseBtn.querySelector('.pause-icon').style.display = 'inline';
            centerPlayButton.style.display = 'none'; // Hide center button when playing
            hideControlsTimeout = setTimeout(hideControls, 3000);
        } else {
            video.pause();
            isPlaying = false;
            playPauseBtn.querySelector('.play-icon').style.display = 'inline';
            playPauseBtn.querySelector('.pause-icon').style.display = 'none';
            centerPlayButton.style.display = 'flex'; // Show center button when paused
            showControls();
        }
    }
    
    // Progress bar interaction
    function handleProgressClick(e) {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * video.duration;
        video.currentTime = newTime;
        updateProgress();
    }
    
    // Enhanced progress bar dragging
    function handleProgressDrag(e) {
        isDragging = true;
        showControls();
        
        const rect = progressBar.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = pos * video.duration;
        
        progressFill.style.width = (pos * 100) + '%';
        progressHandle.style.left = (pos * 100) + '%';
        currentTimeEl.textContent = formatTime(newTime);
        
        video.currentTime = newTime;
    }
    
    // Volume control
    function updateVolume() {
        const volume = volumeSlider.value / 100;
        video.volume = volume;
        
        const volumeIcon = volumeBtn.querySelector('.volume-icon');
        if (volume === 0) {
            volumeIcon.textContent = '🔇';
        } else if (volume < 0.5) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }
    
    // Enhanced Fullscreen functionality
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (playerContainer.requestFullscreen) {
                playerContainer.requestFullscreen();
            } else if (playerContainer.webkitRequestFullscreen) {
                playerContainer.webkitRequestFullscreen();
            } else if (playerContainer.msRequestFullscreen) {
                playerContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    
    // Event listeners
    video.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(video.duration);
        updateProgress();
    });
    
    video.addEventListener('timeupdate', updateProgress);
    
    playPauseBtn.addEventListener('click', togglePlayPause);
    centerPlayBtn.addEventListener('click', togglePlayPause); // Center button click
    
    // Click on video itself to toggle play/pause (center functionality)
    video.addEventListener('click', (e) => {
        // Prevent triggering when clicking on controls
        if (!e.target.closest('.video-controls-overlay')) {
            togglePlayPause();
        }
    });
    
    // Enhanced progress bar events
    progressBar.addEventListener('click', handleProgressClick);
    
    // Mouse drag for progress bar
    progressHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        showControls();
        
        const mouseMoveHandler = (e) => handleProgressDrag(e);
        const mouseUpHandler = () => {
            isDragging = false;
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };
        
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });
    
    // Touch drag for progress bar (mobile)
    progressHandle.addEventListener('touchstart', (e) => {
        isDragging = true;
        showControls();
        
        const touchMoveHandler = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handleProgressDrag(touch);
        };
        const touchEndHandler = () => {
            isDragging = false;
            document.removeEventListener('touchmove', touchMoveHandler);
            document.removeEventListener('touchend', touchEndHandler);
        };
        
        document.addEventListener('touchmove', touchMoveHandler, { passive: false });
        document.addEventListener('touchend', touchEndHandler);
    });
    
    volumeSlider.addEventListener('input', updateVolume);
    volumeBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        volumeSlider.value = video.muted ? 0 : 100;
        updateVolume();
    });
    
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Show controls on mouse move
    playerContainer.addEventListener('mousemove', showControls);
    playerContainer.addEventListener('mouseenter', showControls);
    playerContainer.addEventListener('mouseleave', () => {
        if (isPlaying && !isDragging) {
            hideControls();
        }
    });
    
    // Touch controls for mobile
    playerContainer.addEventListener('touchstart', showControls);
    
    // Double click to fullscreen
    video.addEventListener('dblclick', toggleFullscreen);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case ' ':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                video.currentTime = Math.max(0, video.currentTime - 10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
                break;
        }
    });
    
    // Fullscreen change events
    document.addEventListener('fullscreenchange', () => {
        const fullscreenIcon = fullscreenBtn.querySelector('.fullscreen-icon');
        if (document.fullscreenElement) {
            fullscreenIcon.textContent = '⛶';
            playerContainer.classList.add('fullscreen-active');
        } else {
            fullscreenIcon.textContent = '⛶';
            playerContainer.classList.remove('fullscreen-active');
        }
    });
    
    // Initialize
    updateVolume();
    showControls();
    
    // Auto-play if requested
    if (autoPlay) {
        video.addEventListener('loadedmetadata', () => {
            setTimeout(() => {
                video.play().then(() => {
                    isPlaying = true;
                    playPauseBtn.querySelector('.play-icon').style.display = 'none';
                    playPauseBtn.querySelector('.pause-icon').style.display = 'inline';
                    centerPlayButton.style.display = 'none';
                    console.log(`✅ Auto-playing video: ${videoData.title}`);
                }).catch(e => {
                    console.log('Auto-play prevented by browser:', e);
                    centerPlayButton.style.display = 'flex'; // Show center button if auto-play fails
                });
            }, 100);
        });
    } else {
        // Show center play button initially if not auto-playing
        centerPlayButton.style.display = 'flex';
    }
    
    console.log(`Custom video player initialized for: ${videoData.title}`);
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
    
    // Initialize PROJECT MODAL
    window.projectModal = new ProjectModal();
    
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
    console.log('🎨 Project Modal system initialized with ArtStation-style popup');
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

// =========================
// FIREBASE LIKE SYSTEM
// =========================

/**
 * Firebase-powered Like System
 * Features:
 * - Real-time synchronization between devices
 * - Synchronization between main page and popups
 * - Persistent storage in Firestore
 * - Like/Unlike functionality
 */

// Firebase configuration - provided by user
const firebaseConfig = {
    apiKey: "AIzaSyA6FQ8om1pHSNtNkZY-8FTPxQot9va97s8",
    authDomain: "portfolio-bewertungen.firebaseapp.com",
    projectId: "portfolio-bewertungen",
    storageBucket: "portfolio-bewertungen.firebasestorage.app",
    messagingSenderId: "611847897388",
    appId: "1:611847897388:web:47725eb61cf42c4c152c89",
    measurementId: "G-74LP0HVCHV"
};

class LikeSystem {
    constructor() {
        this.db = null;
        this.app = null;
        this.userLikes = new Set(); // Track user's liked projects
        this.currentLikeCounts = {}; // Cache current like counts
        this.isFirebaseReady = false;
        
        this.init();
    }
    
    async init() {
        try {
            // Load Firebase dynamically
            await this.loadFirebase();
            
            // Initialize Firebase
            this.app = window.firebase.initializeApp(firebaseConfig);
            this.db = window.firebase.firestore();
            
            this.isFirebaseReady = true;
            console.log('🔥 Firebase Like System initialized successfully');
            
            // Load user likes from localStorage
            this.loadUserLikes();
            
            // Setup like buttons
            this.setupLikeButtons();
            
            // Setup real-time listeners
            this.setupRealtimeListeners();
            
            // Load initial like counts
            await this.loadInitialLikeCounts();
            
        } catch (error) {
            console.error('❌ Firebase Like System initialization failed:', error);
            this.handleFirebaseError();
        }
    }
    
    async loadFirebase() {
        // Check if Firebase is already loaded
        if (window.firebase) {
            return;
        }
        
        return new Promise((resolve, reject) => {
            // Load Firebase core
            const firebaseApp = document.createElement('script');
            firebaseApp.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
            firebaseApp.onload = () => {
                // Load Firestore
                const firebaseFirestore = document.createElement('script');
                firebaseFirestore.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js';
                firebaseFirestore.onload = () => resolve();
                firebaseFirestore.onerror = () => reject(new Error('Failed to load Firestore'));
                document.head.appendChild(firebaseFirestore);
            };
            firebaseApp.onerror = () => reject(new Error('Failed to load Firebase'));
            document.head.appendChild(firebaseApp);
        });
    }
    
    loadUserLikes() {
        try {
            const saved = localStorage.getItem('userLikes');
            if (saved) {
                this.userLikes = new Set(JSON.parse(saved));
                console.log('📱 Loaded user likes from storage:', Array.from(this.userLikes));
            }
        } catch (error) {
            console.warn('⚠️ Could not load user likes from storage:', error);
        }
    }
    
    saveUserLikes() {
        try {
            localStorage.setItem('userLikes', JSON.stringify(Array.from(this.userLikes)));
        } catch (error) {
            console.warn('⚠️ Could not save user likes to storage:', error);
        }
    }
    
    setupLikeButtons() {
        // Find all like buttons on the page
        const likeButtons = document.querySelectorAll('.like-btn, .project-modal-like-btn');
        
        likeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const projectId = this.getProjectIdFromButton(button);
                if (projectId) {
                    this.toggleLike(projectId);
                }
            });
        });
        
        console.log(`👆 Setup ${likeButtons.length} like buttons`);
    }
    
    getProjectIdFromButton(button) {
        // Try to get project ID from data attribute
        let projectId = button.getAttribute('data-project-id');
        
        // If not found, try to get from parent project card
        if (!projectId) {
            const projectCard = button.closest('.project-card');
            if (projectCard) {
                projectId = projectCard.getAttribute('data-project-id');
            }
        }
        
        // For modal buttons, get from currently open modal
        if (!projectId && button.id === 'projectModalLikeBtn') {
            const modal = document.getElementById('projectModal');
            if (modal && modal.style.display !== 'none') {
                // Get project ID from modal state or data
                projectId = modal.getAttribute('data-current-project-id');
            }
        }
        
        return projectId;
    }
    
    async toggleLike(projectId) {
        if (!this.isFirebaseReady) {
            console.warn('⚠️ Firebase not ready yet');
            return;
        }
        
        try {
            const isLiked = this.userLikes.has(projectId);
            
            // Optimistic UI update
            this.updateUIOptimistically(projectId, !isLiked);
            
            if (isLiked) {
                await this.unlikeProject(projectId);
                this.userLikes.delete(projectId);
            } else {
                await this.likeProject(projectId);
                this.userLikes.add(projectId);
            }
            
            this.saveUserLikes();
            
            console.log(`${isLiked ? '💔' : '❤️'} Project ${projectId} ${isLiked ? 'unliked' : 'liked'}`);
            
        } catch (error) {
            console.error('❌ Error toggling like:', error);
            // Revert optimistic update on error
            const wasLiked = this.userLikes.has(projectId);
            this.updateUIOptimistically(projectId, wasLiked);
        }
    }
    
    async likeProject(projectId) {
        const docRef = this.db.collection('likes').doc(`project_${projectId}`);
        
        await this.db.runTransaction(async (transaction) => {
            const doc = await transaction.get(docRef);
            
            if (doc.exists) {
                const currentCount = doc.data().count || 0;
                transaction.update(docRef, {
                    count: currentCount + 1,
                    lastUpdated: window.firebase.firestore.FieldValue.serverTimestamp()
                });
            } else {
                transaction.set(docRef, {
                    projectId: projectId,
                    count: 1,
                    created: window.firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdated: window.firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        });
    }
    
    async unlikeProject(projectId) {
        const docRef = this.db.collection('likes').doc(`project_${projectId}`);
        
        await this.db.runTransaction(async (transaction) => {
            const doc = await transaction.get(docRef);
            
            if (doc.exists) {
                const currentCount = doc.data().count || 0;
                const newCount = Math.max(0, currentCount - 1);
                
                transaction.update(docRef, {
                    count: newCount,
                    lastUpdated: window.firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        });
    }
    
    updateUIOptimistically(projectId, isLiked) {
        // Update main page like buttons
        const mainButtons = document.querySelectorAll(`.like-btn[data-project-id="${projectId}"]`);
        mainButtons.forEach(button => {
            this.updateLikeButton(button, projectId, isLiked);
        });
        
        // Update modal like button if it's for this project
        const modalButton = document.getElementById('projectModalLikeBtn');
        const modal = document.getElementById('projectModal');
        if (modalButton && modal && modal.getAttribute('data-current-project-id') === projectId) {
            this.updateModalLikeButton(modalButton, projectId, isLiked);
        }
    }
    
    updateLikeButton(button, projectId, isLiked) {
        const icon = button.querySelector('.like-icon');
        const countSpan = button.querySelector('.like-count');
        
        if (icon) {
            // Update icon fill based on like status
            icon.style.fill = isLiked ? '#ef4444' : 'none';
            icon.style.color = isLiked ? '#ef4444' : 'currentColor';
        }
        
        if (countSpan) {
            // Update count display
            const currentCount = this.currentLikeCounts[projectId] || 0;
            countSpan.textContent = currentCount;
        }
        
        // Update button state
        button.classList.toggle('liked', isLiked);
        
        // Add animation
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
    
    updateModalLikeButton(button, projectId, isLiked) {
        const icon = button.querySelector('.like-icon');
        const textSpan = button.querySelector('.project-modal-like-text');
        const countSpan = button.querySelector('.project-modal-like-count');
        
        if (icon) {
            icon.style.fill = isLiked ? '#ef4444' : 'none';
            icon.style.color = isLiked ? '#ef4444' : 'currentColor';
        }
        
        if (textSpan) {
            textSpan.textContent = isLiked ? 'Liked!' : 'Like this project';
        }
        
        if (countSpan) {
            const currentCount = this.currentLikeCounts[projectId] || 0;
            countSpan.textContent = currentCount;
        }
        
        button.classList.toggle('liked', isLiked);
        
        // Add animation
        button.style.transform = 'scale(1.05)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
    
    setupRealtimeListeners() {
        // Listen for changes to all project likes
        this.db.collection('likes').onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified') {
                    const data = change.doc.data();
                    const projectId = data.projectId;
                    const count = data.count || 0;
                    
                    // Update cached count
                    this.currentLikeCounts[projectId] = count;
                    
                    // Update UI for all buttons of this project
                    this.updateProjectLikeCount(projectId, count);
                }
            });
        }, (error) => {
            console.error('❌ Real-time listener error:', error);
        });
        
        console.log('👂 Real-time listeners setup complete');
    }
    
    updateProjectLikeCount(projectId, count) {
        // Update main page buttons
        const mainButtons = document.querySelectorAll(`.like-btn[data-project-id="${projectId}"]`);
        mainButtons.forEach(button => {
            const countSpan = button.querySelector('.like-count');
            if (countSpan) {
                countSpan.textContent = count;
            }
            
            // Update liked state based on user's likes
            const isLiked = this.userLikes.has(projectId);
            const icon = button.querySelector('.like-icon');
            if (icon) {
                icon.style.fill = isLiked ? '#ef4444' : 'none';
                icon.style.color = isLiked ? '#ef4444' : 'currentColor';
            }
            button.classList.toggle('liked', isLiked);
        });
        
        // Update modal button if showing this project
        const modal = document.getElementById('projectModal');
        const modalButton = document.getElementById('projectModalLikeBtn');
        if (modalButton && modal && modal.getAttribute('data-current-project-id') === projectId) {
            const countSpan = modalButton.querySelector('.project-modal-like-count');
            if (countSpan) {
                countSpan.textContent = count;
            }
            
            const isLiked = this.userLikes.has(projectId);
            const icon = modalButton.querySelector('.like-icon');
            const textSpan = modalButton.querySelector('.project-modal-like-text');
            
            if (icon) {
                icon.style.fill = isLiked ? '#ef4444' : 'none';
                icon.style.color = isLiked ? '#ef4444' : 'currentColor';
            }
            
            if (textSpan) {
                textSpan.textContent = isLiked ? 'Liked!' : 'Like this project';
            }
            
            modalButton.classList.toggle('liked', isLiked);
        }
    }
    
    async loadInitialLikeCounts() {
        try {
            const snapshot = await this.db.collection('likes').get();
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const projectId = data.projectId;
                const count = data.count || 0;
                
                this.currentLikeCounts[projectId] = count;
                this.updateProjectLikeCount(projectId, count);
            });
            
            console.log('📊 Initial like counts loaded:', this.currentLikeCounts);
            
        } catch (error) {
            console.error('❌ Error loading initial like counts:', error);
        }
    }
    
    // Method to sync modal when opened
    syncModalLikes(projectId) {
        const modal = document.getElementById('projectModal');
        const modalButton = document.getElementById('projectModalLikeBtn');
        
        if (modal && modalButton) {
            // Set current project ID on modal
            modal.setAttribute('data-current-project-id', projectId);
            
            // Update modal button state
            const count = this.currentLikeCounts[projectId] || 0;
            const isLiked = this.userLikes.has(projectId);
            
            this.updateModalLikeButton(modalButton, projectId, isLiked);
            
            // Make sure modal button has the project ID
            modalButton.setAttribute('data-project-id', projectId);
        }
    }
    
    handleFirebaseError() {
        console.warn('🔄 Running in offline mode - likes will not persist');
        
        // Setup basic functionality without Firebase
        this.isFirebaseReady = false;
        this.setupLikeButtons();
        
        // Use local storage for basic functionality
        this.loadUserLikes();
    }
    
    // Public method to get like count for a project
    getLikeCount(projectId) {
        return this.currentLikeCounts[projectId] || 0;
    }
    
    // Public method to check if user liked a project
    isProjectLiked(projectId) {
        return this.userLikes.has(projectId);
    }
}

// Initialize the like system when DOM is loaded
let likeSystem;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        likeSystem = new LikeSystem();
    });
} else {
    likeSystem = new LikeSystem();
}

// Hook into existing project modal functionality
// We need to sync likes when modal opens
const originalProjectCardClickHandler = function() {
    // Find existing project card click handler and extend it
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on like button
            if (e.target.closest('.like-btn')) {
                return;
            }
            
            const projectId = card.getAttribute('data-project-id');
            if (projectId && likeSystem) {
                // Sync likes when modal opens
                setTimeout(() => {
                    likeSystem.syncModalLikes(projectId);
                }, 100);
            }
        });
    });
};

// Execute when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', originalProjectCardClickHandler);
} else {
    originalProjectCardClickHandler();
}

// Export for global access if needed
window.LikeSystem = LikeSystem;
window.likeSystem = likeSystem;