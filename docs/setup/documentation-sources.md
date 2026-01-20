# Official Documentation Sources for Tekkr Challenge

This document lists all official documentation and websites that should be indexed in Cursor's "Docs" feature for real-time code information and reference.

---

## Core Framework Documentation

### 1. Fastify
**URL:** `https://fastify.dev/docs/latest/`
**Description:** Official Fastify framework documentation - backend API framework used in this project
**Why:** Essential for understanding Fastify routes, plugins, request/reply patterns, and best practices

### 2. React
**URL:** `https://react.dev/`
**Description:** Official React documentation - frontend library for building user interfaces
**Why:** Core frontend framework - components, hooks, state management, and React patterns

### 3. TypeScript
**URL:** `https://www.typescriptlang.org/docs/`
**Description:** Official TypeScript documentation - type-safe JavaScript
**Why:** Project uses TypeScript throughout - type definitions, interfaces, and TypeScript best practices

---

## State Management & Data Fetching

### 4. React Query (TanStack Query)
**URL:** `https://tanstack.com/query/latest`
**Description:** Official React Query documentation - server state management library
**Why:** Required for all backend interactions - queries, mutations, caching, and state management

---

## UI Components

### 5. shadcn/ui
**URL:** `https://ui.shadcn.com/docs`
**Description:** Official shadcn/ui documentation - component library built on Radix UI
**Why:** All UI components come from shadcn/ui - component usage, styling, and customization

### 6. Radix UI (shadcn/ui foundation)
**URL:** `https://www.radix-ui.com/docs`
**Description:** Radix UI primitives documentation - accessible component primitives
**Why:** shadcn/ui is built on Radix UI - understanding primitives helps with customization

### 7. Tailwind CSS
**URL:** `https://tailwindcss.com/docs`
**Description:** Official Tailwind CSS documentation - utility-first CSS framework
**Why:** All styling uses Tailwind CSS classes - utility classes, responsive design, and theming

---

## LLM Provider Documentation (Choose Based on Selection)

### 8. Google Gemini API
**URL:** `https://ai.google.dev/docs`
**Description:** Official Google Gemini API documentation - for Gemini model integration
**Why:** If using Gemini as LLM provider - API usage, authentication, and model configuration

### 9. OpenAI API
**URL:** `https://platform.openai.com/docs`
**Description:** Official OpenAI API documentation - for GPT models integration
**Why:** If using OpenAI as LLM provider - API usage, authentication, and model configuration

### 10. Anthropic Claude API
**URL:** `https://docs.anthropic.com/claude/`
**Description:** Official Anthropic Claude API documentation - for Claude model integration
**Why:** If using Anthropic as LLM provider - API usage, authentication, and model configuration

---

## Supporting Technologies

### 11. Node.js
**URL:** `https://nodejs.org/docs/latest/api/`
**Description:** Official Node.js documentation - JavaScript runtime for backend
**Why:** Fastify runs on Node.js - understanding Node.js APIs and modules

### 12. npm
**URL:** `https://docs.npmjs.com/`
**Description:** Official npm documentation - package manager
**Why:** Dependency management and package installation

---

## React Ecosystem

### 13. React Router
**URL:** `https://reactrouter.com/en/main`
**Description:** Official React Router documentation - routing for React applications
**Why:** Project uses React Router for navigation and routing

### 14. React Hook Form
**URL:** `https://react-hook-form.com/docs`
**Description:** Official React Hook Form documentation - form state management
**Why:** May be used for form handling in the project

---

## Quick Reference Guide

### Priority 1 (Essential - Add First)
1. ✅ Fastify - `https://fastify.dev/docs/latest/`
2. ✅ React - `https://react.dev/`
3. ✅ React Query - `https://tanstack.com/query/latest`
4. ✅ shadcn/ui - `https://ui.shadcn.com/docs`
5. ✅ TypeScript - `https://www.typescriptlang.org/docs/`

### Priority 2 (Important - Add Next)
6. Tailwind CSS - `https://tailwindcss.com/docs`
7. React Router - `https://reactrouter.com/en/main`
8. Node.js - `https://nodejs.org/docs/latest/api/`

### Priority 3 (LLM Provider - Add Based on Choice)
9. **Choose ONE:**
   - Gemini: `https://ai.google.dev/docs`
   - OpenAI: `https://platform.openai.com/docs`
   - Anthropic: `https://docs.anthropic.com/claude/`

### Priority 4 (Supporting - Optional)
10. Radix UI - `https://www.radix-ui.com/docs`
11. npm - `https://docs.npmjs.com/`
12. React Hook Form - `https://react-hook-form.com/docs`

---

## How to Add These in Cursor

1. Open Cursor Settings (Ctrl+, or Cmd+,)
2. Navigate to **Indexing & Docs** section
3. Click **"+ Add Doc"** button
4. For each documentation source:
   - Enter a descriptive name (e.g., "Fastify Docs")
   - Paste the URL
   - Click "Add" or "Index"
5. Wait for indexing to complete (you'll see progress indicators)

---

## Recommended Order for Adding

**Start with these 5 essential docs:**
1. Fastify Docs
2. React Docs
3. React Query Docs
4. shadcn/ui Docs
5. TypeScript Docs

**Then add based on your needs:**
- Tailwind CSS (for styling questions)
- Your chosen LLM provider (when you decide)
- React Router (for routing questions)
- Node.js (for backend Node.js APIs)

---

## Notes

- **Indexing takes time**: Each documentation source needs to be crawled and indexed
- **Start with essentials**: Add Priority 1 docs first, then expand as needed
- **LLM Provider**: Only add the documentation for the LLM provider you choose to use
- **Update as needed**: You can always add more documentation sources later

---

**Last Updated:** Based on Tekkr Full-Stack Challenge requirements and tech stack
