# 🎨 Moritz Pahrmann VFX Portfolio

Ein professionelles Portfolio für VFX Artist Moritz Pahrmann, entwickelt mit React und FastAPI.

![Portfolio Preview](https://img.shields.io/badge/Portfolio-VFX_Artist-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue)

## 🌟 Features

- **🎯 Multi-Page Portfolio** - Home, About, Contact, Datenschutz, Impressum
- **📱 Responsive Design** - Funktioniert auf allen Geräten
- **🌙 Dark Theme** - Elegantes schwarzes Design mit grünen Akzenten
- **🎬 Video Gallery** - Interaktive Video-Präsentation der Studentenarbeiten
- **📧 Contact Form** - Funktionierendes Kontaktformular mit Backend
- **⚡ Modern Tech Stack** - React, FastAPI, MongoDB, Tailwind CSS

## 🚀 Quick Start

### Voraussetzungen
- Node.js (v14+)
- Python 3.8+
- MongoDB

### Installation

1. **Repository klonen**
```bash
git clone https://github.com/[your-username]/moritz-pahrmann-portfolio.git
cd moritz-pahrmann-portfolio
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt

# .env Datei erstellen
echo "MONGO_URL=mongodb://localhost:27017" > .env
echo "DB_NAME=vfx_portfolio" >> .env

# Server starten
python server.py
```

3. **Frontend Setup**
```bash
cd frontend
yarn install

# .env Datei erstellen
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env

# Frontend starten
yarn start
```

4. **Website besuchen**
```
http://localhost:3000
```

## 📁 Projekt Struktur

```
moritz-pahrmann-portfolio/
├── frontend/           # React Frontend
│   ├── src/
│   │   ├── components/ # Header, Footer
│   │   ├── pages/      # Home, About, Contact, etc.
│   │   └── App.js      # Main App
│   ├── public/
│   └── package.json
├── backend/            # FastAPI Backend
│   ├── server.py       # Main API Server
│   ├── requirements.txt
│   └── .env
└── README.md
```

## 🎨 Anpassungen

### Projekt-Beschreibungen ändern
In `frontend/src/pages/Home.js`:
```javascript
// Zeile 140+
{[
  { 
    title: 'Ihr Projekt Name',
    description: 'Ihre Projektbeschreibung hier...'
  },
  // ... weitere Projekte
]}
```

### Bilder hinzufügen
1. Bilder in `frontend/public/images/` speichern
2. Placeholder divs ersetzen:
```jsx
// Vorher:
<div className="placeholder-image">...</div>

// Nachher:
<img src="/images/ihr-bild.jpg" alt="Projekt Name" />
```

### Videos hinzufügen
In `frontend/src/pages/Home.js`:
```javascript
const videos = [
  { 
    id: 'video1', 
    title: 'Ihr Video', 
    url: '/videos/video.mp4' // oder YouTube URL
  }
];
```

## 🔧 API Endpoints

| Endpoint | Methode | Beschreibung |
|----------|---------|-------------|
| `/api/` | GET | Health Check |
| `/api/contact` | POST | Kontaktformular senden |
| `/api/contact` | GET | Kontakte abrufen |

## 🎯 Deployment

### Frontend (Netlify/Vercel)
```bash
cd frontend
yarn build
# Upload dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Deploy Python app
```

## 🛠️ Tech Stack

- **Frontend:** React 18, Tailwind CSS, React Router
- **Backend:** FastAPI, MongoDB, Python
- **Styling:** Tailwind CSS + Custom CSS
- **Typography:** Inter Font Family
- **Icons:** Emoji (📷, 📧, etc.)

## 📸 Screenshots

### Home Page
- Hero Section mit Name und Titel
- Projekt-Showcase mit 6 Projekten
- Video-Galerie für Studentenarbeiten
- Software Skills Übersicht

### Contact Page
- Professionelles Kontaktformular
- Direkte Email-Integration
- Responsive Design

## 📄 Lizenz

Dieses Projekt ist für Moritz Pahrmann's persönliches Portfolio entwickelt worden.

## 👨‍💻 Entwickler

Entwickelt für **Moritz Pahrmann** - VFX Artist & Student

📧 **Kontakt:** moritzpahrmann6@gmail.com  
📱 **Telefon:** (49) 152 6984

---

⭐ **Star this repo if you like it!**