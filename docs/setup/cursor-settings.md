# Cursor Settings Guide for Tekkr Full-Stack Challenge

## Overview
This guide explains the necessary Cursor IDE settings to ensure the AI agent follows all instructions from the README and maintains consistency throughout development.

## Required Settings Configuration

### 1. User Rules (Global Settings)
**Location:** Cursor Settings → Rules → User Rules

**Purpose:** These rules apply to ALL projects and define your AI pair-programmer's behavior.

**What to Add:**
Your existing user rule (AI-Native Entry-Level Software Engineer) is already configured. This ensures:
- Chain-of-thought planning before implementation
- SOLID/KISS/DRY principles
- Detailed explanations and teaching
- Engineering checklist validation
- Key takeaways and learning resources

**Status:** ✅ Already configured (based on your user rules)

---

### 2. Project Rules (Tekkr-Specific Settings)

**Location:** Project rules are automatically loaded from `.cursorrules` file in the project root.

**Purpose:** These rules are specific to the `tekkr/hiring-test-full-stack` directory and ensure the AI follows the challenge requirements.

**Current Status:** ✅ Project rules file created at `tekkr/hiring-test-full-stack/.cursorrules`

**What's Included:**

The `.cursorrules` file contains:
- Core requirements (LLM integration, state management, UI components)
- Architecture constraints (Fastify, React, TypeScript)
- Feature requirements (chat features, project plan preview, error handling)
- Development workflow guidelines
- Code quality standards

**How It Works:**

Cursor automatically detects and applies rules from `.cursorrules` files in your project directory. The rules are active when you're working in the `tekkr/hiring-test-full-stack` directory.

**Alternative: Manual Setup (if needed)**

If you prefer to add rules manually through Cursor Settings:
1. Open Cursor Settings (Ctrl+, or Cmd+,)
2. Navigate to "Rules" section
3. Click "+ Add Rule" in "Project Rules"
4. Copy the content from `tekkr/hiring-test-full-stack/.cursorrules`
5. Paste and save

**Note:** The `.cursorrules` file method is preferred as it's version-controlled and automatically applied.

---

### 3. Project Commands (Optional but Helpful)
**Location:** Cursor Settings → Rules → Project Commands

**Purpose:** Quick commands for common development tasks.

**How to Add:**

1. Open Cursor Settings (Ctrl+, or Cmd+,)
2. Navigate to "Rules" section
3. Click "+ Add Command" in "Project Commands"
4. Add each command individually, or copy from `docs/setup/project-commands.json`

**Available Commands:**

The commands are also available in `.cursor/commands/my-custom-commands.md` and can be referenced from `docs/setup/project-commands.json`:

- **Start Backend**: `cd server && npm start` - Start the Fastify backend server on port 8000
- **Start Frontend**: `cd web && npm start` - Start the React frontend on port 3000
- **Install Backend Dependencies**: `cd server && npm install` - Install backend npm packages
- **Install Frontend Dependencies**: `cd web && npm install` - Install frontend npm packages

**Note:** These commands assume you're running them from the `tekkr/hiring-test-full-stack/` directory.

---

## Verification Checklist

After configuring settings, verify:

- [ ] User Rules are active (check existing configuration)
- [ ] Project Rules file exists at `tekkr/hiring-test-full-stack/.cursorrules`
- [ ] Project Commands are set up (optional)
- [ ] AI agent references README requirements in responses
- [ ] AI agent plans before implementing
- [ ] AI agent updates docs/planning/development-log.md

**To verify project rules are working:**
1. Open a file in `tekkr/hiring-test-full-stack/`
2. Ask the AI: "What are the requirements for this challenge?"
3. The AI should reference the project rules from `.cursorrules`

---

## How These Settings Help

1. **User Rules**: Ensures consistent code quality, planning, and teaching approach
2. **Project Rules**: Keeps the AI focused on challenge requirements and constraints
3. **Project Commands**: Speeds up common development tasks

---

### 4. Documentation Indexing (Recommended)

**Location:** Cursor Settings → Indexing & Docs → Docs

**Purpose:** Index official documentation so the AI can reference real-time code information and best practices.

**How to Add:**

1. Open Cursor Settings (Ctrl+, or Cmd+,)
2. Navigate to **Indexing & Docs** section
3. Click **"+ Add Doc"** button
4. Add documentation sources from the list in `docs/setup/documentation-sources.md`

**Essential Documentation to Add:**

**Priority 1 (Add First):**
- Fastify: `https://fastify.dev/docs/latest/`
- React: `https://react.dev/`
- React Query: `https://tanstack.com/query/latest`
- shadcn/ui: `https://ui.shadcn.com/docs`
- TypeScript: `https://www.typescriptlang.org/docs/`

**Priority 2 (Add Next):**
- Tailwind CSS: `https://tailwindcss.com/docs`
- React Router: `https://reactrouter.com/en/main`
- Node.js: `https://nodejs.org/docs/latest/api/`

**Priority 3 (Add Based on LLM Choice):**
- Gemini: `https://ai.google.dev/docs` (if using Gemini)
- OpenAI: `https://platform.openai.com/docs` (if using OpenAI)
- Anthropic: `https://docs.anthropic.com/claude/` (if using Anthropic)

**See `docs/setup/documentation-sources.md` for complete list with descriptions.**

**Why This Helps:**
- AI can reference official documentation for accurate API usage
- Real-time access to latest best practices and patterns
- Reduces errors and improves code quality
- Faster development with accurate information

---

## Testing the Configuration

After setup, try asking the AI:
- "What are the requirements for the chat feature?"
- "How should I structure the LLM integration?"
- "What's the plan for implementing project plan previews?"
- "How do I use React Query mutations?" (tests documentation indexing)

The AI should reference the README, project rules, and indexed documentation in its responses.
