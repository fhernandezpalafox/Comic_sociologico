# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive Comic PDF Viewer built with React and Vite. Displays comic pages with animated speech bubbles and Spanish text-to-speech narration.

## Essential Commands

```bash
# Development
npm run dev        # Start Vite dev server (http://localhost:5173)

# Build & Production
npm run build      # Build for production
npm run preview    # Preview production build

# Code Quality
npm run lint       # Run ESLint
```

## Architecture

### Core Stack
- React 19.1.0 with hooks
- Vite 7.0.4 for build/dev
- PDF.js 2.16.105 for comic rendering
- Web Speech API for narration

### Key Components

**`src/App.jsx`** - Main component handling:
- PDF loading and page rendering via PDF.js
- Speech bubble animations tied to page numbers
- Text-to-speech in Spanish (preferably female Latin American voice)
- Navigation controls and keyboard shortcuts

### PDF.js Configuration
Worker configuration in Vite requires:
```javascript
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
```

### Speech Bubbles Structure
Bubbles are defined per page with coordinates and text:
```javascript
{
  1: [
    { x: 50, y: 20, text: "¡Hola!", speaker: "Personaje 1" }
  ]
}
```

## Design System

- Purple gradient theme (#667eea to #764ba2)
- Glassmorphism effects with backdrop filters
- Comic-style animations (pop, slide, fade)
- Responsive breakpoint at 768px

## Development Notes

- No TypeScript - pure JavaScript ES6+
- No test framework configured
- Spanish localization for text and voice
- Comic PDF located at `public/Comic_UVEG.pdf`