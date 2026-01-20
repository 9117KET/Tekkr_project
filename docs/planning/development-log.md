# Development Log - `Tekkr` Full-Stack Challenge

> **Purpose**: This file tracks the entire development process, key decisions, special implementations, and talking points for the final video explanation.

---

## Project Overview

**Challenge**: Build an LLM-based chat application with project plan preview functionality

**Tech Stack**:
- **Backend**: `Fastify` (Node.js/TypeScript)
- **Frontend**: React + TypeScript
- **State Management**: React Query
- **UI Components**: `shadcn/ui`
- **LLM**: Anthropic (Claude)

**Time Limit**: 3-4 hours

---

## Development Timeline

### Phase 0: Setup & Planning
**Date**: Current Session
**Status**: ✅ Completed

#### Tasks Completed

**1. Requirements Analysis**
- [x] Read and understand README requirements
  - **Why**: Essential to understand all feature requirements, constraints, and deliverables before coding
  - **Key Insights**: 
    - LLM-based chat with persistence
    - Project plan preview with inline rendering
    - 3-4 hour time limit (prioritization critical)
    - No database needed (simplifies architecture)

**2. Codebase Exploration**
- [x] Explore existing codebase structure
  - **Why**: Understand existing patterns, components, and architecture to maintain consistency
  - **Findings**:
    - Backend: `Fastify` with auto-loading plugin system
    - Frontend: React with TypeScript, `shadcn/ui` components already installed
    - Existing components: ChatSidebar, ChatInputBox, Message (dummy data)
    - React Query already set up in `App.tsx`

**3. Development Environment Setup**
- [x] Configure Cursor IDE settings for optimal AI assistance
  - **Why**: Ensure AI follows project requirements and maintains consistency
  - **Actions Taken**:
    - Created `.cursorrules` file in project root (automatically detected by Cursor)
    - Documented setup process in `docs/setup/cursor-settings.md`
    - Verified project rules are working correctly

**4. Documentation Structure**
- [x] Create comprehensive documentation structure
  - **Why**: Organized documentation enables efficient development and video preparation
  - **Structure Created**:
    - `docs/setup/` - Configuration guides (cursor-settings, getting-started, project-commands, documentation-sources)
    - `docs/planning/` - Project planning (project-plan, development-log)
    - `docs/learning/` - Tech stack onboarding
  - **Benefits**: Easy navigation, scalable structure, clean project root

**5. Project Planning Documents**
- [x] Create tech stack onboarding document
  - **Why**: Understand technologies before coding to make informed decisions
  - **Content**: `Fastify`, React, React Query, `shadcn/ui` explanations with real-world analogies
- [x] Create project plan with chain-of-thought breakdown
  - **Why**: Plan architecture and implementation before coding (follows project rules)
  - **Content**: Problem analysis, architecture design, 4-phase implementation plan, risk assessment

**6. Development Tracking**
- [x] Create development log (this file)
  - **Why**: Track progress, decisions, and talking points for final video explanation
  - **Purpose**: Document entire journey for 2-5 minute video walkthrough

**7. Project Configuration**
- [x] Set up project rules (`.cursorrules`)
  - **Why**: Ensure AI agent follows challenge requirements automatically
  - **Location**: `tekkr/hiring-test-full-stack/.cursorrules`
  - **Content**: Core requirements, architecture constraints, feature requirements, workflow, code quality standards

**8. Development Tools Setup**
- [x] Create project commands reference
  - **Why**: Quick access to common development tasks
  - **Files**: `docs/setup/project-commands.json`, `.cursor/commands/my-custom-commands.md`
  - **Commands**: Start Backend/Frontend, Install Dependencies

**9. Documentation Indexing Preparation**
- [x] Create documentation sources list
  - **Why**: Prepare list of official docs to index in Cursor for real-time code information
  - **File**: `docs/setup/documentation-sources.md`
  - **Priority List**: `Fastify`, React, React Query, `shadcn/ui`, TypeScript (essential), plus LLM provider docs

**10. Verification & Testing**
- [x] Verify project rules are working
  - **Why**: Ensure AI agent correctly references project requirements
  - **Test**: Asked "What are the requirements for the chat feature?" - AI correctly referenced `.cursorrules` and README

#### Key Decisions

- **LLM Provider**: Anthropic (Claude)
  - **Decision Point**: We started with Anthropic for Phase 1 to get a working end-to-end LLM integration quickly.
  - **Impact**: Provider remains swappable via the `LLMProvider` abstraction + factory.

- **Storage Strategy**: localStorage for frontend persistence, in-memory for backend
  - **Rationale**: Requirements explicitly state no database needed
  - **Impact**: Simplifies architecture, sufficient for single-user scenario
  - **Implementation**: Backend uses Map/object for in-memory storage, frontend uses localStorage

- **Architecture Pattern**: Strategy Pattern for LLM abstraction
  - **Decision**: Use interface + implementations for LLM providers
  - **Rationale**: Follows Open/Closed Principle, enables easy provider swapping
  - **Impact**: Clean separation, extensible design

- **Documentation Organization**: Categorized folder structure
  - **Decision**: Organize docs into setup/planning/learning subfolders
  - **Rationale**: Scalable, easy navigation, keeps project root clean
  - **Impact**: Better developer experience, easier to find information

#### Special Considerations for Video

- **Setup Phase Highlights**:
  - Show the organized documentation structure (`docs/` folder)
  - Explain the `.cursorrules` file and how it guides development
  - Demonstrate how project rules ensure consistency
  - Show the planning documents (chain-of-thought approach)

- **Why This Phase Matters**:
  - Proper setup prevents rework and ensures consistency
  - Documentation structure demonstrates organization skills
  - Planning phase shows thoughtful approach to problem-solving
  - Project rules ensure AI assistance stays aligned with requirements

#### Time Spent
- **Estimated**: ~1-2 hours
- **Actual**: [To be filled]
- **Breakdown**:
  - Requirements analysis: 15 min
  - Codebase exploration: 20 min
  - Documentation creation: 45 min
  - Configuration setup: 20 min
  - Verification: 10 min

#### Files Created/Modified

**Documentation Files:**
- `docs/README.md` - Documentation index
- `docs/setup/cursor-settings.md` - Cursor IDE configuration guide
- `docs/setup/getting-started.md` - Complete setup and workflow guide
- `docs/setup/project-commands.json` - Project commands reference
- `docs/setup/documentation-sources.md` - Official docs to index
- `docs/planning/project-plan.md` - Architecture and implementation plan
- `docs/planning/development-log.md` - This file (progress tracking)
- `docs/learning/tech-stack-onboarding.md` - Tech stack explanations

**Configuration Files:**
- `.cursorrules` - Project rules (automatically detected by Cursor)
- `.cursor/commands/my-custom-commands.md` - Custom commands
- `.cursor/skills/tekkrrules/SKILL.md` - Project rules skill (backup)

#### Lessons Learned

1. **Planning First**: Taking time to understand requirements and plan architecture saves time during implementation
2. **Documentation Organization**: Well-organized docs make development faster and video preparation easier
3. **Project Rules**: Having explicit rules ensures AI assistance stays aligned with requirements
4. **Chain-of-Thought**: Breaking down problems before coding leads to better solutions

---

### Phase 1: Backend LLM Integration
**Date**: Current Session
**Status**: ✅ Completed

#### Planning (Chain of Thought)
- [x] Analyze requirements for LLM + chat endpoints
- [x] Design abstraction layer for LLM providers (Strategy + Factory)
- [x] Plan chat storage structure (in-memory store; no DB)
- [x] Design REST API endpoints

#### Implementation Notes
- **Files Created**:
  - `server/src/domain/chat/types.ts`: Chat + Message types and request DTOs
  - `server/src/domain/chat/store.ts`: In-memory `ChatStore` (singleton instance export)
  - `server/src/domain/llm/types.ts`: `LLMProvider` interface + provider type union
  - `server/src/domain/llm/factory.ts`: `LLMProviderFactory` (env-driven provider selection)
  - `server/src/domain/llm/providers/anthropic.ts`: Anthropic implementation using `@anthropic-ai/sdk`
  - `server/src/domain/llm/providers/openai.ts`: Stub (not implemented yet)
  - `server/src/domain/llm/providers/gemini.ts`: Stub (not implemented yet)
  - `server/src/routes/api/chats/index.ts`: Chat REST API routes at `/api/chats/*`
  - `server/.env.example`: Environment variable template (API keys + provider selection)
- **Files Modified**:
  - `server/package.json`: PowerShell-safe `npm start` (via `prestart`) + Anthropic SDK dependency
  - `server/.gitignore`: Ignore `.env*` files
  - `server/src/plugins/support.ts`: Skip auth for `/` and `/api/chats*` (single-user requirement)
- **Key Design Patterns**:
  - **Strategy Pattern**: `LLMProvider` interface with provider implementations
  - **Factory Pattern**: `LLMProviderFactory` selects provider via env (`LLM_PROVIDER`)
  - **Singleton (lightweight)**: `chatStore` exported as a single instance for in-memory state

#### Manual Testing (Backend)
- [x] `POST /api/chats` creates a chat
- [x] `GET /api/chats` lists chats
- [x] `GET /api/chats/:chatId` returns chat + messages
- [x] `POST /api/chats/:chatId/messages` stores user message, calls LLM, stores assistant response

#### Debug Story (Worth Mentioning in Video)
- **Issue**: LLM calls failed with `404 not_found_error` from Anthropic.
- **Root cause**: Model ID `claude-3-5-sonnet-20241022` was not available/was deprecated for the account.
- **Fix**: Defaulted `ANTHROPIC_MODEL` fallback to `claude-sonnet-4-20250514` and verified success end-to-end.
  - **Why this matters in real projects**: third-party model/version identifiers can change; configs should be explicit and easy to swap.

#### Special Aspects for Video
- [x] Show the LLM abstraction (`LLMProvider`) + factory (`LLMProviderFactory`)
- [x] Explain provider swapping via env (`LLM_PROVIDER`, `ANTHROPIC_MODEL`)
- [x] Demonstrate error handling path for invalid requests + missing chats + LLM failures
- [x] Call out the “real-world debugging” lesson: model IDs and permissions can break integrations

---

### Phase 2: Frontend Chat Implementation
**Date**: Current Session
**Status**: ✅ Completed

#### Planning (Chain of Thought)
- [x] Design chat state management with React Query (query keys, invalidation)
- [x] Plan localStorage persistence strategy (selected chat id + best-effort cache)
- [x] Design chat creation and selection flow (create → select; sidebar selection persists)
- [x] Plan loading states and error handling (loading indicator + small inline errors)

#### Implementation Notes
- **Files Created**:
  - `web/src/data/queries/chat.ts`: Chat queries + mutations (`useChatsQuery`, `useChatQuery`, `useCreateChatMutation`, `useSendMessageMutation`)
  - `web/src/lib/persistence.ts`: localStorage helpers (`loadSelectedChatId`, `saveSelectedChatId`, optional cache helpers)
- **Files Modified**:
  - `web/src/pages/home-page.tsx`: Removed dummy data and wired UI to backend via React Query + persistence
- **React Query Hooks**:
  - `useChatsQuery()` → `GET /api/chats`
  - `useChatQuery(chatId)` → `GET /api/chats/:chatId`
  - `useCreateChatMutation()` → `POST /api/chats` + invalidate `['chats']`
  - `useSendMessageMutation(chatId)` → `POST /api/chats/:chatId/messages` + invalidate `['chat', chatId]` and `['chats']`

#### Manual Testing (Minimum)
- [x] Backend smoke test: create chat → send message → fetch chat (confirmed 2 messages returned)
- [x] Frontend build passes (`npm run build`)

#### Special Aspects for Video
- [x] Show React Query hooks layer (`web/src/data/queries/chat.ts`) and how the UI stays thin
- [x] Demonstrate localStorage persistence (selected chat survives reload)
- [x] Show loading indicator (`AssistantLoadingIndicator`) during LLM response
- [x] Explain state flow: sidebar selects `chatId` → `useChatQuery(chatId)` fetches messages → send mutation invalidates chat query

---

### Phase 3: Project Plan Preview Feature
**Date**: Current Session
**Status**: ✅ Completed

#### Planning (Chain of Thought)
- [x] Analyze project plan structure (workstreams → deliverables)
- [x] Decide on a reliable LLM output format (tagged JSON inside message)
- [x] Design parsing logic for project plans in LLM responses (fail-closed JSON parsing + type guard)
- [x] Design expandable/collapsible UI component
- [x] Plan inline rendering within message content (text-before / preview / text-after)

#### Implementation Notes
- **Files Created**:
  - `web/src/types/project-plan.ts`: `ProjectPlan` / `Workstream` / `Deliverable` types
  - `web/src/lib/project-plan-parser.ts`: extracts `<project_plan>...</project_plan>` and parses JSON safely
  - `web/src/components/project-plan-preview.tsx`: inline preview UI with collapsible workstreams
- **Files Modified**:
  - `server/src/domain/llm/types.ts`: `LLMProvider.sendMessage(messages, { systemPrompt })` to support structured output prompts
  - `server/src/domain/llm/providers/anthropic.ts`: passes `system` prompt to Anthropic messages API when present
  - `server/src/domain/llm/providers/openai.ts`, `server/src/domain/llm/providers/gemini.ts`: updated signature to match interface
  - `server/src/routes/api/chats/index.ts`: when user requests a project plan, add system prompt + parse & attach `projectPlan` on assistant message
  - `web/src/components/message.tsx`: renders message text with optional inline project plan preview
  - `web/src/pages/home-page.tsx`: uses `MessageBody` for inline rendering and fixes selection persistence under React StrictMode
- **Parsing Strategy**:
  - Backend instructs the LLM: include exactly one `<project_plan>` JSON block only for project plan requests
  - Frontend extracts the tag block, parses JSON, validates the schema, then renders it inline
  - If parsing fails, fallback is plain text (graceful failure)

#### Special Aspects for Video
- [x] Show how project plans are detected in messages (simple `/project plan/i` intent + tagged JSON block)
- [x] Demonstrate expandable/collapsible functionality (workstreams)
- [x] Show inline rendering (plan appears mid-message, not only at the end)
- [x] Explain the parsing/rendering logic (extract tags → JSON parse → schema validate → render)
- [x] Mention the real-world “gotcha” we fixed: React StrictMode can run effects twice; persistence needed a restore gate to avoid clearing localStorage on mount

---

### Phase 4: Bonus Features (If Time Permits)
**Date**: Current Session
**Status**: ✅ Completed (Polish)

#### Planning (Chain of Thought)
- [x] Add an error boundary to prevent “blank screen” failures
- [x] Display user-friendly network errors with clear recovery actions (retry)
- [x] Prevent accidental actions during pending states (disable New Chat while creating)
- [ ] Bonus: model selector UI (not implemented)

#### Implementation Notes
- **Files Created**:
  - `web/src/components/error-boundary.tsx`: React error boundary with reset/reload actions
- **Files Modified**:
  - `web/src/App.tsx`: Wrap router with `ErrorBoundary`
  - `web/src/pages/home-page.tsx`: Add retriable error states for chats + chat load + message send
  - `web/src/components/chat-sidebar.tsx`: Disable New Chat button when create callback is unavailable

---

## Key Architectural Decisions

### 1. LLM Abstraction Layer
**Decision**: [To be filled]
**Rationale**: [To be filled]
**Impact**: Makes it easy to swap LLM providers

### 2. State Management Strategy
**Decision**: [To be filled]
**Rationale**: [To be filled]
**Impact**: [To be filled]

### 3. Persistence Strategy
**Decision**: localStorage for frontend, in-memory for backend
**Rationale**: Requirements specify no database needed
**Impact**: Simple but sufficient for single-user scenario

### 4. Project Plan Parsing
**Decision**: [To be filled]
**Rationale**: [To be filled]
**Impact**: [To be filled]

---

## Technical Challenges & Solutions

### Challenge 1: [To be filled]
**Problem**: [To be filled]
**Solution**: [To be filled]
**Lessons Learned**: [To be filled]

---

## Code Quality Highlights

### What Makes This Solution Clean
- [To be filled as we build]

### Design Patterns Used
- [To be filled as we build]

### SOLID Principles Applied
- [To be filled as we build]

---

## Video Explanation Talking Points

### Introduction (30 seconds)
- Brief overview of the challenge
- Tech stack chosen
- Time spent

### Architecture Overview (1 minute)
- Backend structure (`Fastify`)
- Frontend structure (React + React Query)
- LLM abstraction layer
- Data flow diagram (mental or visual)

### Key Features Walkthrough (2-3 minutes)
1. **Chat Functionality**
   - Show creating new chat
   - Show switching between chats
   - Show message sending with loading
   - Show persistence on reload

2. **Project Plan Preview**
   - Show requesting a project plan
   - Show inline preview rendering
   - Show expandable/collapsible sections
   - Show mid-message rendering

3. **LLM Abstraction** (if time)
   - Show the abstraction layer code
   - Explain how to swap providers

### Code Highlights (1 minute)
- Show key files and explain logic
- Highlight clean architecture decisions
- Show error handling

### Conclusion (30 seconds)
- What worked well
- What could be improved
- Repository link

---

## Commit History

### Commit 1: [To be filled]
**Message**: [To be filled]
**Changes**: [To be filled]

---

## Final Checklist Before Submission

- [ ] All features implemented
- [ ] Error handling in place
- [ ] Chat history persists on reload
- [ ] Selected chat persists on reload
- [ ] Project plan preview works inline
- [ ] Code is clean and well-structured
- [ ] LLM abstraction allows easy swapping
- [ ] Repository is public
- [ ] Video is recorded (2-5 minutes)
- [ ] docs/planning/development-log.md is complete

---

## Notes for Future Reference

- [Any additional notes, gotchas, or insights]
