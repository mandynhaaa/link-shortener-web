# 🚨 IMPORTANT: MONOREPO SUB-DIRECTORY

> 💡 **Looking for the main project repository?** This directory is just the backend layer of a decoupled workspace. All global configurations, prerequisites, full installation guides, and execution scripts are centralized in the **[Main Repository Root](../README.md)**.

---
# Brev.ly Web - Frontend Client

A responsive, highly fluid UI built for interacting with the Brev.ly Link Shortener API. It focuses heavily on intuitive validation feedback and immediate state updates.

## ⚡ Tech Stack & UI Engineering

- **Framework:** React & [Vite](https://vite.dev/) (For ultra-fast building and Hot Module Replacement)
- **Styling:** TailwindCSS (Utility-first atomic styling)
- **State Architecture:** [Zustand](https://zustand-demo.pmnd.rs/) with `immer` middleware for lightweight, immutable state tree updates utilizing native JavaScript `Map` objects.
- **Form Management:** React Hook Form bound with a Zod Resolver for instant user validation.
- **Analytical Routing:** React Router v6 implementing asynchronous tracking tokens and automatic browser fallback mechanics for seamless UX redirection.

## ⚙️ UX Engineering Features

- **Asynchronous Safe Actions:** Operations waiting for API resolutions block UI actions via loading indicators and explicitly bubble HTTP errors up using Toast notifications.
- **Prefix Isolation parsing:** The form UI abstracts custom domain naming (`brev.ly/`) cleanly so users don't have to manually format slugs.
- **Dual-Hit Protection:** Redirection logic uses explicit references (`useRef`) to safely neutralize React StrictMode double-mounting behavior, preventing synthetic click inflation on metrics tracking.