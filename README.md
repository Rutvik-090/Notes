# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Smart Notes – AI-Enhanced Note-Taking App

Smart Notes is a modern, intuitive note-taking application that combines the power of AI with real-time grammar checking and intelligent highlighting. Designed for developers, students, and professionals, it helps you capture, organize, and refine your ideas effortlessly.

## Features
- **Rich Text Editor** – Bold, italic, underline, and font-size adjustments.
- **Grammar Check** – Real-time grammar highlighting with suggestions.
- **Glossary Highlighting** – Automatically highlights predefined terms with tooltips.
- **AI Summary & Tags** – Generate concise summaries and context-aware tags using Hugging Face APIs.
- **Pin Notes** – Keep your important notes at the top.
- **Persistent Storage** – Notes and pinned status persist across sessions (localStorage or backend).
- **User-Friendly UI** – Clean, responsive interface with toolbar and keyboard shortcuts.

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **AI Services:** Hugging Face APIs
- **Grammar Check:** LanguageTool API
- **Storage:** LocalStorage (or can be integrated with backend)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-notes.git
   cd smart-notes
