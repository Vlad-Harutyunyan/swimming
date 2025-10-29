# Schwimmschule - Swimming from Zero to Hero

Eine moderne, responsive Schwimmschule-Website, entwickelt mit React, TypeScript, Vite und Tailwind CSS.

## 🚀 Features

- **Moderne Technologie**: React 18, TypeScript, Vite
- **Responsive Design**: Optimiert für alle Geräte
- **Performance**: Lazy Loading, Code Splitting, Optimierte Bundle-Größe
- **Accessibility**: WCAG-konforme Benutzeroberfläche
- **SEO**: Optimierte Meta-Tags und Struktur
- **State Management**: Zustand mit Zustand
- **Styling**: Tailwind CSS mit benutzerdefinierten Komponenten
- **Animationen**: Framer Motion für flüssige Übergänge
- **Formulare**: React Hook Form mit Validierung
- **Icons**: Lucide React Icons

## 🛠️ Technologie-Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Animationen**: Framer Motion
- **Formulare**: React Hook Form + Zod
- **Icons**: Lucide React
- **Linting**: ESLint + Prettier

## 📦 Installation

### Voraussetzungen

- Node.js 18+ 
- npm 8+

### Setup

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd swimming
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

4. **Browser öffnen**
   ```
   http://localhost:3000
   ```

## 🎯 Verfügbare Scripts

```bash
# Entwicklungsserver starten
npm run dev

# Production Build erstellen
npm run build

# Build Preview
npm run preview

# Linting
npm run lint
npm run lint:fix

# Code Formatting
npm run format

# Type Checking
npm run type-check

# Tests ausführen
npm run test
npm run test:ui
npm run coverage
```

## 📁 Projektstruktur

```
src/
├── components/          # Wiederverwendbare Komponenten
│   ├── ui/             # Basis UI-Komponenten
│   ├── Navigation.tsx   # Hauptnavigation
│   ├── Hero.tsx        # Hero-Sektion
│   ├── CourseCard.tsx  # Kurs-Karten
│   └── Footer.tsx      # Footer
├── pages/              # Seiten-Komponenten
│   ├── Home.tsx        # Startseite
│   ├── Courses.tsx     # Kurse-Übersicht
│   ├── CourseDetail.tsx # Kurs-Details
│   └── ...
├── hooks/              # Custom Hooks
│   ├── useAppStore.ts  # Zustand Store
│   └── index.ts        # Utility Hooks
├── types/              # TypeScript Typen
├── utils/              # Utility Funktionen
├── constants/          # Konstanten
├── data/               # Statische Daten
├── styles/             # Globale Styles
└── assets/             # Bilder und Assets
```

## 🎨 Design System

### Farben
- **Primary**: Blau-Töne für Hauptaktionen
- **Secondary**: Grün-Töne für sekundäre Aktionen  
- **Accent**: Gelb-Töne für Highlights
- **Neutral**: Grau-Töne für Text und Hintergründe

### Typografie
- **Display**: Poppins (Überschriften)
- **Body**: Inter (Fließtext)

### Komponenten
- **Button**: Verschiedene Varianten (primary, secondary, outline, ghost)
- **Card**: Konsistente Karten-Layouts
- **Input**: Formularelemente mit Validierung
- **Navigation**: Responsive Navigation mit Mobile Menu

## 📱 Responsive Design

- **Mobile First**: Optimiert für mobile Geräte
- **Breakpoints**: 
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

## ♿ Accessibility

- **WCAG 2.1 AA**: Konforme Implementierung
- **Keyboard Navigation**: Vollständige Tastatursteuerung
- **Screen Reader**: Optimiert für Screen Reader
- **Focus Management**: Sichtbare Focus-Indikatoren
- **Color Contrast**: Ausreichende Farbkontraste

## 🚀 Performance

- **Code Splitting**: Automatische Code-Aufteilung
- **Lazy Loading**: Komponenten werden bei Bedarf geladen
- **Image Optimization**: Optimierte Bilder
- **Bundle Analysis**: Kleinere Bundle-Größen
- **Caching**: Effiziente Caching-Strategien

## 🧪 Testing

```bash
# Unit Tests
npm run test

# Test UI (interaktiv)
npm run test:ui

# Coverage Report
npm run coverage
```

## 📦 Deployment

### Vercel (Empfohlen)
```bash
npm run build
# Upload dist/ Ordner zu Vercel
```

### Netlify
```bash
npm run build
# Upload dist/ Ordner zu Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔧 Konfiguration

### Environment Variables
Erstellen Sie eine `.env` Datei:
```env
VITE_API_URL=https://api.example.com
VITE_GOOGLE_MAPS_API_KEY=your_api_key
```

### Tailwind Konfiguration
Anpassungen in `tailwind.config.js`:
- Farben
- Schriftarten
- Breakpoints
- Animationen

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

## 📞 Support

Bei Fragen oder Problemen:
- 📧 Email: info@schwimmschule.de
- 📱 Telefon: +49 (0) 123 456 789
- 🌐 Website: https://schwimmschule.de

---

**Entwickelt mit ❤️ für die Schwimmschule**