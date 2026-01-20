# Tech Stack Onboarding - Tekkr Full-Stack Challenge

> **Purpose**: Understand the fundamental technologies used in this project to build and understand the workflow effectively.

---

## Overview

This project uses a **modern full-stack TypeScript architecture** with:
- **Backend**: Fastify (lightweight Node.js framework)
- **Frontend**: React with TypeScript
- **State Management**: React Query (TanStack Query)
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)

---

## Backend: Fastify

### What is Fastify?
Fastify is a **fast, low-overhead web framework** for Node.js, similar to Express but with better performance and built-in TypeScript support.

### Key Concepts

#### 1. **Plugin System**
Fastify uses plugins to organize code. Each plugin is a self-contained module.

**Real-world analogy**: Like LEGO blocks - each plugin is a block that adds specific functionality.

**In this project**:
- `plugins/` directory contains reusable functionality (CORS, sensible defaults, etc.)
- `routes/` directory contains API endpoints organized by feature

**Example from codebase**:
```typescript
// server/src/routes/user/index.ts
const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    // Handle GET /user request
  });
};
```

#### 2. **Auto-Loading**
The `@fastify/autoload` plugin automatically loads all files from directories.

**Why it matters**: You don't need to manually import every route/plugin. Just add a file, and it's loaded.

**In this project**:
```typescript
// server/src/app.ts
void fastify.register(AutoLoad, {
  dir: join(__dirname, 'routes'),  // Auto-loads all routes
})
```

#### 3. **Request/Reply Pattern**
- `request`: Incoming HTTP request data
- `reply`: Object to send HTTP responses

**Example**:
```typescript
fastify.get('/api/chat', async (request, reply) => {
  const data = { message: "Hello" };
  reply.send(data);  // Sends JSON response
});
```

### Workflow for Adding Endpoints

1. Create a new file in `server/src/routes/[feature]/index.ts`
2. Export a `FastifyPluginAsync` function
3. Define routes using `fastify.get()`, `fastify.post()`, etc.
4. Auto-loading picks it up automatically

**Example**:
```typescript
// server/src/routes/chat/index.ts
import { FastifyPluginAsync } from 'fastify'

const chat: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/messages', async (request, reply) => {
    // Handle POST /chat/messages
    const { message } = request.body;
    // Process message...
    reply.send({ response: "AI response here" });
  });
};

export default chat;
```

### Resources
- [Fastify Documentation](https://fastify.dev/docs/latest/)
- [Fastify Plugins Guide](https://fastify.dev/docs/latest/Guides/Plugins-Guide/)

---

## Frontend: React + TypeScript

### What is React?
React is a **JavaScript library for building user interfaces** using a component-based architecture.

### Key Concepts

#### 1. **Components**
Components are reusable pieces of UI that return JSX (HTML-like syntax).

**Real-world analogy**: Like building blocks - each component is a block you can reuse.

**In this project**:
- `components/` contains reusable UI components
- `pages/` contains full page components
- `App.tsx` is the root component

**Example from codebase**:
```typescript
// web/src/components/chat-input-box.tsx
export function ChatInputBox({onSend}: { onSend: (message: string) => void }) {
  const [input, setInput] = useState("");
  // Component logic...
  return <div>...</div>;
}
```

#### 2. **State Management with useState**
`useState` manages component-level state (data that changes over time).

**Example**:
```typescript
const [chatId, setChatId] = useState<string | null>(null);
// chatId: current value
// setChatId: function to update the value
```

#### 3. **Props**
Props are data passed from parent to child components.

**Example**:
```typescript
<ChatSidebar 
  chats={dummyChats}           // prop: chats
  selectedChatId={chatId}      // prop: selectedChatId
  onSelectChat={setChatId}     // prop: callback function
/>
```

### React Router
**Purpose**: Handles navigation and routing in single-page applications.

**In this project**:
```typescript
// web/src/App.tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  }
]);
```

**How it works**: When URL is `/`, React Router renders `<HomePage />`.

### Resources
- [React Documentation](https://react.dev/)
- [TypeScript with React](https://react-typescript-cheatsheet.netlify.app/)

---

## State Management: React Query (TanStack Query)

### What is React Query?
React Query is a **data-fetching and state management library** for server state. It handles caching, background updates, and synchronization.

### Why Use React Query?
- **Automatic caching**: Fetched data is cached automatically
- **Background refetching**: Keeps data fresh
- **Loading/error states**: Built-in state management
- **Optimistic updates**: Update UI before server confirms

### Key Concepts

#### 1. **QueryClient**
The central client that manages all queries and mutations.

**In this project**:
```typescript
// web/src/App.tsx
<QueryClientProvider client={new QueryClient()}>
  {/* App components */}
</QueryClientProvider>
```

#### 2. **useQuery Hook**
Fetches data and manages loading/error states.

**Example** (what we'll build):
```typescript
import { useQuery } from '@tanstack/react-query';

function ChatList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['chats'],
    queryFn: () => fetch('/api/chats').then(res => res.json())
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return <div>{data.map(chat => ...)}</div>;
}
```

#### 3. **useMutation Hook**
Handles POST/PUT/DELETE operations (side effects).

**Example** (what we'll build):
```typescript
import { useMutation } from '@tanstack/react-query';

function ChatInput() {
  const mutation = useMutation({
    mutationFn: (message: string) => 
      fetch('/api/chat/messages', {
        method: 'POST',
        body: JSON.stringify({ message })
      }).then(res => res.json())
  });
  
  const handleSend = () => {
    mutation.mutate(inputText);
  };
}
```

### Workflow for API Integration

1. **Define query/mutation** using `useQuery` or `useMutation`
2. **Call API** in the `queryFn` or `mutationFn`
3. **Handle states** (loading, error, success) automatically
4. **Update cache** when needed

### Resources
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Query Essentials](https://tanstack.com/query/latest/docs/react/overview)

---

## UI Components: shadcn/ui

### What is shadcn/ui?
shadcn/ui is a **collection of reusable components** built on Radix UI and styled with Tailwind CSS. You copy components into your project (not installed as a package).

### Key Concepts

#### 1. **Component Structure**
Components are in `src/components/ui/` and are regular React components.

**In this project**:
- `button.tsx`, `input.tsx`, `textarea.tsx`, etc.
- All styled with Tailwind CSS classes

#### 2. **Usage**
Import and use like any React component:

```typescript
import { Button } from "./ui/button";

<Button onClick={handleClick}>Click Me</Button>
```

#### 3. **Styling**
Uses Tailwind CSS utility classes:
- `className="flex gap-2"` → flexbox with gap
- `className="w-full"` → full width
- `variant="secondary"` → component-specific variants

### Resources
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## Data Flow Architecture

### How Data Flows in This Application

```
User Action (Frontend)
    ↓
React Component (e.g., ChatInputBox)
    ↓
React Query Mutation/Query
    ↓
HTTP Request (axios/fetch)
    ↓
Fastify Backend Route
    ↓
Business Logic (LLM call, data processing)
    ↓
HTTP Response
    ↓
React Query Cache Update
    ↓
React Component Re-render
    ↓
UI Update
```

### Example: Sending a Chat Message

1. **User types** message in `ChatInputBox`
2. **User clicks Send** → `onSend(message)` called
3. **React Query mutation** sends POST to `/api/chat/messages`
4. **Fastify route** receives request, calls LLM API
5. **LLM responds** → Fastify sends response back
6. **React Query** updates cache with new message
7. **Chat component** re-renders with new message

---

## Development Workflow

### Starting the Application

1. **Backend**:
   ```bash
   cd server
   npm install
   npm start  # Runs on port 8000
   ```

2. **Frontend**:
   ```bash
   cd web
   npm install
   npm start  # Runs on port 3000
   ```

### Making Changes

- **Backend**: TypeScript compiles automatically, Fastify auto-reloads
- **Frontend**: React hot-reloads on file changes

### Project Structure

```
hiring-test-full-stack/
├── docs/                   # Documentation
│   ├── setup/             # Setup guides
│   ├── planning/           # Project planning
│   └── learning/           # Learning resources
├── server/                 # Backend (Fastify)
│   ├── src/
│   │   ├── app.ts         # Main app setup
│   │   ├── routes/        # API endpoints
│   │   ├── plugins/       # Fastify plugins
│   │   └── domain/        # Business logic
│   └── package.json
│
└── web/                    # Frontend (React)
    ├── src/
    │   ├── App.tsx        # Root component
    │   ├── pages/         # Page components
    │   ├── components/    # Reusable components
    │   ├── data/          # React Query hooks
    │   └── lib/           # Utilities
    └── package.json
```

---

## Key Takeaways

1. **Fastify**: Plugin-based, auto-loading, TypeScript-first
2. **React**: Component-based, props, state management
3. **React Query**: Server state management, caching, automatic updates
4. **shadcn/ui**: Copy-paste components, Tailwind CSS styling
5. **Data Flow**: User → Component → React Query → API → Backend → Response → UI

---

## Learning Resources

### Videos
- [Fastify Crash Course](https://www.youtube.com/results?search_query=fastify+tutorial)
- [React Query Tutorial](https://www.youtube.com/watch?v=novnyCaa7To) - by Web Dev Simplified
- [shadcn/ui Setup](https://www.youtube.com/watch?v=6h29-R6k9-Y) - by Traversy Media

### Documentation
- [Fastify Docs](https://fastify.dev/docs/latest/)
- [React Docs](https://react.dev/)
- [React Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui Docs](https://ui.shadcn.com/docs)

---

## Next Steps

1. ✅ Understand the tech stack (you're here!)
2. ⏭️ Plan the LLM integration architecture
3. ⏭️ Implement backend chat endpoint
4. ⏭️ Implement frontend chat UI
5. ⏭️ Add project plan preview feature
