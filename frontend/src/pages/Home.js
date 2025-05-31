import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({
    id: 'midterm300',
    title: 'Midterm300',
    url: 'YOUR_VIDEO_URL_HERE'
  });

  const videos = [
    { id: 'midterm300', title: 'Midterm300', url: 'YOUR_VIDEO_URL_HERE' },
    { id: 'project2', title: 'Animation Project', url: 'YOUR_VIDEO_URL_2' },
    { id: 'project3', title: 'VFX Demo Reel', url: 'YOUR_VIDEO_URL_3' },
    { id: 'project4', title: '3D Rendering', url: 'YOUR_VIDEO_URL_4' },
    { id: 'project5', title: 'Motion Graphics', url: 'YOUR_VIDEO_URL_5' },
    { id: 'project6', title: 'Character Animation', url: 'YOUR_VIDEO_URL_6' }
  ];

  const loadVideo = () => {
    const videoContainer = document.getElementById('videoContainer');
    const videoURL = currentVideo.url;
    
    if (videoURL === 'YOUR_VIDEO_URL_HERE' || videoURL.includes('YOUR_VIDEO_URL')) {
      alert('Please replace YOUR_VIDEO_URL_HERE in the script with your actual video URL.\\n\\nFor YouTube: https://www.youtube.com/embed/VIDEO_ID\\nFor local files: ./videos/your-video.mp4');
      return;
    }
    
    if (videoURL.includes('youtube.com') || videoURL.includes('youtu.be')) {
      videoContainer.innerHTML = `
        <iframe className="video-embed w-full h-full border-none rounded-xl" 
                src="${videoURL}?autoplay=1" 
                allowFullScreen>
        </iframe>
      `;
    } else {
      videoContainer.innerHTML = `
        <video className="video-embed w-full h-full border-none rounded-xl" controls autoPlay>
          <source src="${videoURL}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    }
  };

  const toggleVideoGallery = () => {
    setIsGalleryOpen(!isGalleryOpen);
  };

  const selectVideo = (video) => {
    setCurrentVideo(video);
    // Reset video container
    const videoContainer = document.getElementById('videoContainer');
    if (videoContainer) {
      videoContainer.innerHTML = `
        <div className="placeholder-video w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex flex-col items-center justify-center text-6xl gap-5">
          <span className="text-7xl">▶</span>
          <span className="text-center text-lg">Play Video<br/>(Replace with video URL)</span>
        </div>
      `;
    }
  };

  const scrollVideoStrip = (direction) => {
    const strip = document.getElementById('videoStrip');
    if (strip) {
      const thumbnailWidth = 220;
      const scrollAmount = thumbnailWidth * 2;
      strip.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Scroll animations
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

    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="hero relative h-screen flex items-center justify-center overflow-hidden mt-20">
        <div className="hero-bg absolute top-0 left-0 w-full h-full -z-10">
          <div className="placeholder-image hero-placeholder w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-2xl font-semibold text-center text-gray-500">
            <span>3D Bedroom Scene<br/>(Replace with hero image)</span>
          </div>
        </div>
        <div className="hero-content text-center z-10">
          <h1 className="hero-title text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight mb-2 text-white text-shadow-lg">Moritz Pahrmann</h1>
          <p className="hero-subtitle text-lg md:text-xl lg:text-2xl font-light tracking-widest opacity-90">VFX ARTIST</p>
        </div>
      </section>

      {/* My Story Section */}
      <section className="story-section py-24 px-12 bg-white text-black fade-in">
        <div className="story-container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="story-content">
            <h2 className="text-7xl font-normal leading-tight mb-8">My<br/>Story</h2>
            <div className="divider w-16 h-0.5 bg-black mb-8"></div>
            <button className="read-more-btn bg-transparent text-black border-2 border-black py-3 px-8 text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-black hover:text-white">Read More</button>
          </div>
          <div className="story-info">
            <h3 className="text-2xl font-semibold mb-5">Get to Know My</h3>
            <p className="text-base leading-relaxed mb-4 opacity-80">I am currently a student specializing in 3D Visual Effects at FOI. VRM and would like to introduce my work and connect with you.</p>
            <p className="text-base leading-relaxed mb-4 opacity-80">I create high-quality 3D renders and designs that can support your next digital visualization project.</p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section py-24 px-12 bg-black relative fade-in">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-radial from-green-400/10 via-green-400/5 to-transparent pointer-events-none z-10"></div>
        <div className="relative z-20">
          <h2 className="projects-title text-6xl md:text-8xl lg:text-9xl font-extrabold text-center mb-10 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent tracking-tight">PROJEKTS</h2>
          <p className="projects-description max-w-4xl mx-auto mb-20 text-center text-lg leading-relaxed opacity-80">This is where I showcase a selection of 3D renders I created during my studies and for freelance projects. Each piece reflects my passion for visual storytelling, technical growth, and creative exploration in the world of digital design.</p>
          
          <div className="projects-grid max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { 
                title: 'Project Title 1',
                description: 'Hier ist die Beschreibung für Projekt 1. Ein beeindruckendes 3D-Rendering mit detaillierter Texturierung und Beleuchtung.'
              },
              { 
                title: 'Project Title 2',
                description: 'Beschreibung für Projekt 2. Eine komplexe Animation mit fortgeschrittenen VFX-Techniken und Partikelsystemen.'
              },
              { 
                title: 'Project Title 3',
                description: 'Projekt 3 Beschreibung. Ein architektonisches Rendering mit realistischen Materialien und atmosphärischer Beleuchtung.'
              },
              { 
                title: 'Project Title 4',
                description: 'Beschreibung für das vierte Projekt. Character Design und Animation mit detaillierter Rigging-Arbeit.'
              },
              { 
                title: 'Project Title 5',
                description: 'Fünftes Projekt Beschreibung. Produktvisualisierung mit fotorealistischem Rendering und Compositing.'
              },
              { 
                title: 'Project Title 6',
                description: 'Sechstes Projekt Beschreibung. Umgebungsdesign mit prozeduralen Texturen und dynamischer Simulation.'
              }
            ].map((project, index) => (
              <div key={index} className="project-card bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 border border-white border-opacity-10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-400/30 hover:border-green-400/50">
                <div className="placeholder-image project-placeholder h-64 bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-lg">
                  <span>Project Image<br/>(Replace)</span>
                </div>
                <div className="project-info p-6">
                  <div className="project-title text-2xl font-bold mb-4 text-center">{project.title}</div>
                  <div className="project-description text-sm opacity-80 leading-relaxed text-center">
                    {project.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Work Section */}
      <section className="student-work py-24 px-12 bg-gray-900 text-center fade-in">
        <h2 className="student-title text-5xl font-semibold mb-16">Student Work</h2>
        
        {/* Main Video Display */}
        <div className="main-video-section max-w-4xl mx-auto mb-10">
          <h3 className="video-title text-4xl font-normal mb-10 text-green-400">{currentVideo.title}</h3>
          <div className="video-container relative bg-gray-700 rounded-xl overflow-hidden aspect-video" id="videoContainer">
            <div className="placeholder-video w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex flex-col items-center justify-center text-6xl gap-5">
              <span className="text-7xl">▶</span>
              <span className="text-center text-lg">Play Video<br/>(Replace with video URL)</span>
            </div>
            <button 
              className="play-video-btn absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-400/90 text-white border-none py-4 px-8 rounded-full text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-green-400 hover:scale-105"
              onClick={loadVideo}
            >
              Play Video
            </button>
          </div>
        </div>

        {/* More Videos Button */}
        <div className="more-videos-controls my-10">
          <button 
            className="more-videos-btn bg-gray-700 text-white border-2 border-green-400 py-3 px-8 rounded-full text-base font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-3 hover:bg-green-400 hover:text-black"
            onClick={toggleVideoGallery}
          >
            <span>{isGalleryOpen ? 'Hide Videos' : 'More Videos'}</span>
            <span className={`arrow transition-transform duration-300 text-sm ${isGalleryOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
        </div>

        {/* Video Gallery */}
        <div className={`video-gallery mt-10 transition-all duration-500 ${isGalleryOpen ? 'opacity-100 translate-y-0 block' : 'opacity-0 translate-y-5 hidden'}`}>
          <div className="video-strip-container relative max-w-6xl mx-auto flex items-center gap-5">
            <button 
              className="nav-arrow bg-gray-700 text-green-400 border-2 border-green-400 w-12 h-12 rounded-full text-2xl font-bold cursor-pointer transition-all duration-300 flex items-center justify-center flex-shrink-0 hover:bg-green-400 hover:text-black hover:scale-110"
              onClick={() => scrollVideoStrip(-1)}
            >
              ‹
            </button>
            
            <div className="video-strip flex gap-5 overflow-x-hidden scroll-smooth py-5 flex-1" id="videoStrip">
              {videos.map((video, index) => (
                <div 
                  key={video.id}
                  className={`video-thumbnail relative min-w-[200px] h-32 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                    currentVideo.id === video.id ? 'border-green-400 shadow-green-400/50' : 'border-transparent'
                  } hover:-translate-y-1 hover:border-green-400 hover:shadow-green-400/30`}
                  onClick={() => selectVideo(video)}
                >
                  <div className="video-thumb-placeholder w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xs text-center">
                    <span>Video {index + 1}<br/>{video.title}</span>
                  </div>
                  <div className="video-thumb-overlay absolute top-0 left-0 right-0 bottom-0 bg-black/60 flex items-center justify-center opacity-0 transition-all duration-300 hover:opacity-100">
                    <span className="play-icon text-green-400 text-2xl">▶</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="nav-arrow bg-gray-700 text-green-400 border-2 border-green-400 w-12 h-12 rounded-full text-2xl font-bold cursor-pointer transition-all duration-300 flex items-center justify-center flex-shrink-0 hover:bg-green-400 hover:text-black hover:scale-110"
              onClick={() => scrollVideoStrip(1)}
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* Software Skills Section */}
      <section className="skills-section py-24 px-12 bg-black text-center fade-in">
        <h2 className="skills-title text-5xl font-semibold mb-16">Software Skills</h2>
        <div className="skills-grid max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {['Maya', 'After Effects', 'Nuke', 'RSS', 'Unreal', 'Arnold', 'Blender', 'Photoshop', 'Affinity', 'Affinity 2'].map((skill, index) => (
            <div key={index} className="skill-icon bg-gray-900 border-2 border-gray-600 rounded-xl py-8 px-5 text-base font-semibold text-white transition-all duration-300 cursor-pointer hover:bg-green-400 hover:border-green-400 hover:-translate-y-1 hover:text-black">
              {skill}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;