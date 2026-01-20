# 🚀 Start Here - Tekkr Full-Stack Challenge

Welcome! This document guides you through the setup and development process.

---

## ✅ What's Been Set Up

### 1. Documentation Created
- **docs/setup/cursor-settings.md**: Complete guide for configuring Cursor IDE settings
- **docs/learning/tech-stack-onboarding.md**: Comprehensive tech stack explanation
- **docs/planning/project-plan.md**: Chain-of-thought breakdown of the entire solution
- **docs/planning/development-log.md**: Tracking document for video explanation

### 2. Project Structure Understood
- Backend: Fastify (TypeScript) in `server/`
- Frontend: React (TypeScript) in `web/`
- Existing components and routes analyzed

---

## 📋 Step-by-Step Setup

### Step 1: Configure Cursor Settings (5 minutes)

1. **Open Cursor Settings**
   - Press `Ctrl+,` (Windows) or `Cmd+,` (Mac)
   - Or: File → Preferences → Settings

2. **Project Rules (Tekkr Challenge Rules)**
   - **Preferred**: Project rules are auto-loaded from `tekkr/hiring-test-full-stack/.cursorrules` (version-controlled).
   - **Optional (manual)**: If you want to add rules via the UI:
     - Navigate to: Rules → Project Rules
     - Click "+ Add Rule"
     - Copy the content from `.cursorrules`
     - Paste and save

3. **Verify Configuration**
   - Ask the AI: "What are the requirements for this challenge?"
   - It should reference the README and project rules

### Step 2: Read the Onboarding (15 minutes)

**Read these in order:**
1. **docs/learning/tech-stack-onboarding.md** - Understand Fastify, React, React Query, shadcn/ui
2. **docs/planning/project-plan.md** - Understand the architecture and implementation plan
3. **docs/planning/development-log.md** - Understand how to track progress

**Why this matters:**
- You'll understand every technology before coding
- You'll know the architecture before implementing
- You'll be ready to explain everything in the video

### Step 3: Install Dependencies (5 minutes)

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd web
npm install
```

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
Backend runs on: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd web
npm start
```
Frontend runs on: http://localhost:3000 (CRA may prompt and use 3001 if 3000 is busy)

---

## 🔐 Environment Variables (LLM Providers)

You can use **Anthropic**, **OpenAI**, or **Gemini**. If an API key is missing and you select that provider/model, the app will show a helpful error message.

**Backend (`server/`)**
- `ANTHROPIC_API_KEY` (required for Anthropic)
- `ANTHROPIC_MODEL` (optional, default: `claude-sonnet-4-20250514`)
- `OPENAI_API_KEY` (required for OpenAI)
- `OPENAI_DEFAULT_MODEL` (optional, default: `gpt-4o-mini`)
- `GEMINI_API_KEY` (required for Gemini)
- `GEMINI_DEFAULT_MODEL` (optional, default: `gemini-2.0-flash`)

---

## 🎯 Development Workflow

### Before Each Feature

1. **Plan First** (Chain of Thought)
   - Read the relevant section in `docs/planning/project-plan.md`
   - Understand the architecture
   - Ask the AI to explain if unclear

2. **Update docs/planning/development-log.md**
   - Add planning notes
   - Document decisions

### During Implementation

1. **Follow the Plan**
   - Implement according to `docs/planning/project-plan.md`
   - Ask AI for help when stuck
   - Keep code clean and well-structured

2. **Test Incrementally**
   - Test each feature as you build
   - Fix issues immediately

### After Each Feature

1. **Commit Your Work**
   ```bash
   git add .
   git commit -m "Phase X: [Feature Name] - [Brief description]"
   ```

2. **Update docs/planning/development-log.md**
   - Mark feature as complete
   - Add implementation notes
   - Add talking points for video

---

## 📚 Key Documents Reference

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **docs/setup/cursor-settings.md** | Configure Cursor IDE | Before starting |
| **docs/learning/tech-stack-onboarding.md** | Understand technologies | Before coding |
| **docs/planning/project-plan.md** | Architecture & implementation plan | Before each phase |
| **docs/planning/development-log.md** | Track progress for video | Continuously update |
| **README.md** | Challenge requirements | Reference as needed |

---

## 🏗️ Implementation Phases

### Phase 1: Backend Foundation (45-60 min)
- LLM abstraction layer
- Chat storage
- API endpoints

**Start here:** Read `docs/planning/project-plan.md` → Phase 1 section

### Phase 2: Frontend Chat Integration (60-75 min)
- React Query setup
- Chat UI integration
- LocalStorage persistence

**Start here:** Read `docs/planning/project-plan.md` → Phase 2 section

---

## ✅ How to Test the App (Quick Manual)

This is the minimum manual test path to validate Phase 1 + Phase 2 before starting Phase 3.

1. Start backend (`server/`) and frontend (`web/`).
2. Open the app at `http://localhost:3000`.
3. Click **New Chat** → a chat should appear in the sidebar and become selected.
4. Send a message → you should see:
   - your message appear
   - a loading indicator while waiting
   - the assistant response appear
5. Refresh the page:
   - the same chat should remain selected
   - the chat history should still be available

### Bonus (Model Selector)
6. Select a chat → use **Model** selector to choose provider + model → click **Apply**
7. Send a message → the selected provider/model should be used for that chat
8. Switch chats → each chat keeps its own provider/model selection

### Phase 3: Project Plan Preview (45-60 min)
- Project plan parsing
- Preview component
- Inline rendering

**Start here:** Read `docs/planning/project-plan.md` → Phase 3 section

### Phase 4: Polish & Bonus (30-45 min)
- Error handling
- Model selector (bonus)
- Final testing

**Start here:** Read `docs/planning/project-plan.md` → Phase 4 section

---

## 🎥 Video Explanation Preparation

As you develop, keep these in mind for the final video:

### What to Explain (2-5 minutes)

1. **Architecture Overview** (1 min)
   - Backend structure (Fastify)
   - Frontend structure (React + React Query)
   - LLM abstraction layer

2. **Key Features** (2-3 min)
   - Chat functionality
   - Project plan preview
   - LLM provider swapping

3. **Code Highlights** (1 min)
   - Show key files
   - Explain design decisions

### How to Prepare

- **Update docs/planning/development-log.md** as you go
- **Note special aspects** to highlight
- **Document design decisions** and why
- **Keep it simple** - focus on clarity

---

## 🚨 Important Reminders

### Time Management
- **3-4 hour limit** - Don't over-engineer
- **Prioritize core features** - Bonus is optional
- **Stop when time is up** - Submit what you have

### Code Quality
- **Follow existing patterns** - Don't change existing code unnecessarily
- **Keep it simple** - YAGNI principle
- **Error handling** - Graceful errors everywhere

### Requirements Checklist
- [x] LLM-based chat works
- [x] New chat button works
- [x] Chat switching works
- [x] Loading indicators work
- [x] Persistence on reload works (chat list + selected chat)
- [x] Project plan preview works inline (can appear mid-message)
- [x] Expandable/collapsible sections work
- [x] Error handling works (graceful UI states + readable API errors)
- [x] LLM can be swapped easily (provider abstraction + per-chat selection)

---

## 🆘 Getting Help

### If You're Stuck

1. **Check the docs:**
   - `docs/learning/tech-stack-onboarding.md` for tech questions
   - `docs/planning/project-plan.md` for architecture questions
   - `README.md` for requirements

2. **Ask the AI:**
   - "How does [technology] work in this context?"
   - "What's the plan for [feature]?"
   - "Help me implement [specific thing]"

3. **Review existing code:**
   - Look at `server/src/routes/user/index.ts` for route examples
   - Look at `web/src/pages/home-page.tsx` for component structure

---

## ✅ Pre-Flight Checklist

Before starting implementation:

- [ ] Cursor settings configured (Project Rules added)
- [ ] Dependencies installed (both backend and frontend)
- [ ] Servers can start successfully
- [ ] Read docs/learning/tech-stack-onboarding.md
- [ ] Read docs/planning/project-plan.md
- [ ] Understand the challenge requirements
- [ ] docs/planning/development-log.md is ready to update

---

## 🎬 Ready to Start?

1. ✅ Configure Cursor settings
2. ✅ Read onboarding docs
3. ✅ Install dependencies
4. ✅ Start servers
5. 🚀 Begin Phase 1: Backend Foundation

**Good luck! You've got this!** 💪

---

## 📝 Quick Commands Reference

```bash
# Backend
cd server
npm install
npm start

# Frontend
cd web
npm install
npm start

# Git (after each phase)
git add .
git commit -m "Phase X: [Description]"
```

---

**Next Step:** Open `docs/planning/project-plan.md` and start with Phase 1! 🚀
