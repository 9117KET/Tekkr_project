# Project Plan - Tekkr Full-Stack Challenge

> **Chain-of-Thought Breakdown**: This document breaks down the entire solution using step-by-step reasoning before implementation.

---

## Problem Analysis

### Requirements Summary
1. **LLM-based chat**: Convert existing chat UI into functional LLM chat
2. **Chat management**: Create, switch, and persist chats
3. **Project plan preview**: Inline, expandable preview of project plans in messages
4. **Persistence**: Chat history and selection persist on page reload
5. **Error handling**: Graceful error handling throughout
6. **LLM abstraction**: Easy to swap LLM providers

### Constraints
- 3-4 hour time limit
- In-memory storage (no database)
- Single user (no authentication)
- Use React Query for backend interactions
- Use shadcn/ui components
- Avoid changing existing code unless necessary

---

## Architecture Design (Chain of Thought)

### Step 1: Understanding the Current State

**What exists:**
- Frontend: React app with dummy chat UI
  - `ChatSidebar`: Displays chats, has "New Chat" button
  - `ChatInputBox`: Input field with send functionality
  - `Message`: Message display component
  - `HomePage`: Main page orchestrating components
- Backend: Fastify server with example routes
  - Auto-loading plugin system
  - CORS configured
  - Example user route

**What's missing:**
- Backend: No chat endpoints, no LLM integration
- Frontend: No React Query hooks, no localStorage persistence, no LLM communication

### Step 2: Data Structure Design

**Chat Structure:**
```typescript
interface Chat {
  id: string;              // Unique identifier
  name: string;            // Display name (can be auto-generated)
  messages: Message[];     // Array of messages
  createdAt: number;       // Timestamp
  updatedAt: number;       // Last update timestamp
}

interface Message {
  id: string;              // Unique identifier
  role: "user" | "assistant";
  content: string;         // Text content
  projectPlan?: ProjectPlan; // Optional project plan data
  timestamp: number;
}

interface ProjectPlan {
  workstreams: Workstream[];
}

interface Workstream {
  title: string;
  description: string;
  deliverables: Deliverable[];
}

interface Deliverable {
  title: string;
  description: string;
}
```

**Storage Strategy:**
- **Backend**: In-memory Map/object storing chats by ID
- **Frontend**: localStorage for persistence (key: `tekkr-chats`, `tekkr-selected-chat-id`)

### Step 3: LLM Integration Architecture

**Problem**: Need to support multiple LLM providers (Gemini, OpenAI, Anthropic) with easy swapping.

**Solution**: Abstract LLM interface + provider implementations

**Design Pattern**: Strategy Pattern

```typescript
// Abstraction layer
interface LLMProvider {
  sendMessage(messages: Message[]): Promise<string>;
  getName(): string;
}

// Implementations
class OpenAIProvider implements LLMProvider { ... }
class GeminiProvider implements LLMProvider { ... }
class AnthropicProvider implements LLMProvider { ... }

// Factory/Registry
class LLMProviderFactory {
  static create(providerName: string): LLMProvider { ... }
}
```

**Why this design:**
- **Open/Closed Principle**: Open for extension (new providers), closed for modification
- **Dependency Inversion**: Backend depends on abstraction, not concrete implementations
- **Easy swapping**: Change one line of code to swap providers

### Step 4: Backend API Design

**Endpoints Needed:**

1. **POST /api/chats**
   - Create new chat
   - Returns: `{ id, name, messages: [] }`

2. **GET /api/chats**
   - Get all chats
   - Returns: `Chat[]`

3. **GET /api/chats/:chatId**
   - Get specific chat with messages
   - Returns: `Chat`

4. **POST /api/chats/:chatId/messages**
   - Send message to chat
   - Body: `{ content: string }`
   - Returns: `{ message: Message, response: Message }` (user message + LLM response)

**Why these endpoints:**
- RESTful design
- Clear separation of concerns
- Easy to understand and maintain

### Step 5: Frontend State Management Design

**React Query Setup:**

```typescript
// Queries
- useChats(): Get all chats
- useChat(chatId): Get specific chat

// Mutations
- useCreateChat(): Create new chat
- useSendMessage(chatId): Send message to chat
```

**Local Storage Strategy:**
- On chat creation/update: Save to localStorage
- On app load: Restore from localStorage
- Sync with backend: Backend is source of truth, localStorage is cache

**Why React Query:**
- Automatic caching
- Background refetching
- Loading/error states
- Optimistic updates possible

### Step 6: Project Plan Preview Feature

**Problem**: Detect and render project plans inline in messages.

**Approach 1: Structured Output**
- Ask LLM to return JSON for project plans
- Parse JSON and render

**Approach 2: Markdown Parsing**
- LLM returns markdown
- Parse markdown for project plan structure
- Render as component

**Approach 3: Hybrid**
- Use structured output when possible
- Fallback to markdown parsing
- Use regex/parsing to detect project plan sections

**Decision**: **Approach 1 (Structured Output)** - Most reliable, cleanest implementation

**Implementation:**
1. Detect when user asks for "project plan"
2. Use LLM's structured output capability (if available)
3. Parse response into `ProjectPlan` interface
4. Render `ProjectPlanPreview` component inline in message

**Rendering Strategy:**
- Parse message content
- If `projectPlan` exists in message, render preview component
- Support mid-message rendering (split content before/after preview)

### Step 7: Error Handling Strategy

**Backend:**
- Try-catch around LLM calls
- Return structured error responses: `{ error: string, code: string }`
- Use Fastify's error handling

**Frontend:**
- React Query handles HTTP errors automatically
- Display user-friendly error messages
- Retry logic (React Query default)

---

## Implementation Plan

### Phase 1: Backend Foundation (45-60 minutes)

#### 1.1 LLM Abstraction Layer
**Files to create:**
- `server/src/domain/llm/types.ts` - Interfaces
- `server/src/domain/llm/providers/openai.ts` - OpenAI implementation
- `server/src/domain/llm/providers/gemini.ts` - Gemini implementation (or chosen one)
- `server/src/domain/llm/factory.ts` - Provider factory

**Steps:**
1. Define `LLMProvider` interface
2. Implement chosen provider (start with one)
3. Create factory for easy swapping
4. Add environment variable for provider selection

#### 1.2 Chat Storage
**Files to create:**
- `server/src/domain/chat/types.ts` - Type definitions
- `server/src/domain/chat/store.ts` - In-memory store

**Steps:**
1. Define Chat, Message types
2. Create in-memory Map storage
3. Add CRUD operations (create, read, update)

#### 1.3 API Endpoints
**Files to create:**
- `server/src/routes/chat/index.ts` - Chat routes

**Steps:**
1. POST /api/chats - Create chat
2. GET /api/chats - List all chats
3. GET /api/chats/:chatId - Get chat
4. POST /api/chats/:chatId/messages - Send message

**Dependencies needed:**
- LLM SDK (e.g., `@google/generative-ai` or `openai`)

### Phase 2: Frontend Chat Integration (60-75 minutes)

#### 2.1 React Query Setup
**Files to create:**
- `web/src/data/queries/chat.ts` - React Query hooks

**Steps:**
1. Create `useChats()` query
2. Create `useChat(chatId)` query
3. Create `useCreateChat()` mutation
4. Create `useSendMessage(chatId)` mutation

#### 2.2 API Client
**Files to modify/create:**
- `web/src/data/client.ts` - Axios/fetch client

**Steps:**
1. Set up base URL
2. Create API functions for chat endpoints

#### 2.3 Chat UI Integration
**Files to modify:**
- `web/src/pages/home-page.tsx` - Main chat page
- `web/src/components/chat-sidebar.tsx` - Sidebar with real data
- `web/src/components/chat-input-box.tsx` - Connect to API

**Steps:**
1. Replace dummy data with React Query hooks
2. Connect "New Chat" button to mutation
3. Connect message sending to mutation
4. Add loading states
5. Display messages from API

#### 2.4 LocalStorage Persistence
**Files to create:**
- `web/src/lib/persistence.ts` - localStorage utilities

**Steps:**
1. Save chats to localStorage on updates
2. Restore chats on app load
3. Save selected chat ID
4. Restore selected chat on load

### Phase 3: Project Plan Preview (45-60 minutes)

#### 3.1 Project Plan Parsing
**Files to create:**
- `web/src/lib/project-plan-parser.ts` - Parsing logic
- `web/src/types/project-plan.ts` - Type definitions

**Steps:**
1. Define ProjectPlan types
2. Create parser for LLM response
3. Handle structured output or markdown

#### 3.2 Project Plan Component
**Files to create:**
- `web/src/components/project-plan-preview.tsx` - Preview component

**Steps:**
1. Create expandable/collapsible workstreams
2. Create deliverables list
3. Style to match design (from image)

#### 3.3 Message Rendering
**Files to modify:**
- `web/src/components/message.tsx` - Message component

**Steps:**
1. Parse message content for project plans
2. Render project plan inline
3. Support mid-message rendering

### Phase 4: Polish & Bonus (30-45 minutes)

#### 4.1 Error Handling
**Steps:**
1. Add error boundaries
2. Display user-friendly errors
3. Handle network failures

#### 4.2 Bonus: Model Selector (if time)
**Files to create:**
- `web/src/components/model-selector.tsx`

**Steps:**
1. Create UI for model selection
2. Add endpoint to switch models
3. Update LLM provider based on selection

#### 4.3 Testing & Documentation
**Steps:**
1. Test all features
2. Update docs/planning/development-log.md
3. Prepare video talking points

---

## Risk Assessment

### Risks & Mitigations

1. **LLM API Rate Limits**
   - **Risk**: Hitting rate limits during development
   - **Mitigation**: Use free tier, implement retry logic

2. **Project Plan Parsing Complexity**
   - **Risk**: LLM returns inconsistent format
   - **Mitigation**: Use structured output, add fallback parsing

3. **Time Overrun**
   - **Risk**: Exceeding 3-4 hour limit
   - **Mitigation**: Prioritize core features, skip bonus if needed

4. **State Synchronization**
   - **Risk**: localStorage and backend out of sync
   - **Mitigation**: Backend is source of truth, localStorage is cache

---

## Success Criteria

### Must Have (Core Features)
- [ ] User can create new chats
- [ ] User can switch between chats
- [ ] Messages are sent to LLM and responses displayed
- [ ] Loading indicator during LLM responses
- [ ] Chat history persists on reload
- [ ] Selected chat persists on reload
- [ ] Project plan preview renders inline
- [ ] Project plan sections are expandable/collapsible
- [ ] Error handling works gracefully
- [ ] LLM provider can be swapped easily

### Nice to Have (Bonus)
- [ ] Model selector UI
- [ ] Multiple model support

---

## Next Steps

1. ✅ Complete planning (this document)
2. ⏭️ Start Phase 1: Backend Foundation
3. ⏭️ Commit after each phase
4. ⏭️ Update docs/planning/development-log.md continuously
5. ⏭️ Test incrementally

---

## Key Architectural Decisions Summary

1. **LLM Abstraction**: Strategy pattern with interface + implementations
2. **Storage**: In-memory backend + localStorage frontend
3. **State Management**: React Query for server state
4. **Project Plans**: Structured output with inline rendering
5. **Error Handling**: Structured errors + user-friendly messages

---

## Resources for Implementation

### LLM SDKs
- OpenAI: `openai` npm package
- Gemini: `@google/generative-ai` npm package
- Anthropic: `@anthropic-ai/sdk` npm package

### Documentation
- [Fastify Routes](https://fastify.dev/docs/latest/Guides/Routes/)
- [React Query Mutations](https://tanstack.com/query/latest/docs/react/guides/mutations)
- [shadcn/ui Accordion](https://ui.shadcn.com/docs/components/accordion) (for expandable sections)

---

**Ready to start implementation!** 🚀
