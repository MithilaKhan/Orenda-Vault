import { ActionCard, Collection, Note, ActivityItem, WorkspaceChatMessage } from '@/types/workspace';

export const QUICK_ACTION_CARDS: ActionCard[] = [
  {
    id: 'quick-note',
    title: 'Create Note',
    description: 'Capture thoughts with a rich-text editor and organize into collections.',
    icon: 'FileEdit',
    actionType: 'note',
  },
  {
    id: 'save-code',
    title: 'Code Snippet',
    description: 'Save code blocks with language detection, syntax preview, and context notes.',
    icon: 'Code2',
    actionType: 'code',
  },
  {
    id: 'new-collection',
    title: 'New Collection',
    description: 'Create a themed folder to organize and group related notes together.',
    icon: 'FolderPlus',
    actionType: 'collection',
  },
  {
    id: 'summarize-content',
    title: 'Summarize Content',
    description: 'Paste any text and let AI extract a concise, actionable summary.',
    icon: 'Sparkles',
    actionType: 'summarize',
  },
];

export const SEARCH_SUGGESTIONS: string[] = [
  'My recent notes',
  'Code snippets',
  'Meeting action items',
  'Summarize my notes',
];

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'Portfolio Hero Copy',
    icon: 'Briefcase',
    description: 'Headline ideas, value propositions, and bio copy.',
    noteCount: 3,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'col-2',
    name: 'React Notes',
    icon: 'Code2',
    description: 'Hook patterns, Server Actions, and Next.js 16 architecture.',
    noteCount: 4,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'col-3',
    name: 'Resume Summary',
    icon: 'FileText',
    description: 'Career highlights and recruiter-ready bullet points.',
    noteCount: 2,
    createdAt: Date.now() - 86400000 * 2,
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'JWT Authentication Breakdown',
    content: `# What is a JSON Web Token (JWT)?\n\nA JWT is a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is digitally signed using JSON Web Signature (JWS).\n\n### Structure of a JWT:\n1. **Header**: Consists of two parts: the token type (JWT) and the signing algorithm (e.g., HMAC SHA256 or RSA).\n2. **Payload**: Contains the claims (user ID, expiration time, roles).\n3. **Signature**: Validates that the sender of the JWT is who it says it is and ensures the message wasn't changed along the way.\n\n\`\`\`ts\n// Example decoding snippet\nconst token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";\n\`\`\``,
    summary: 'A brief guide on JWT header, payload, and signature structure for secure authentication.',
    category: 'React Notes',
    collectionId: 'col-2',
    isFavorite: true,
    isTrashed: false,
    createdAt: Date.now() - 3600000 * 4,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'note-2',
    title: 'Portfolio Hero Headline Drafts',
    content: `# High-Converting Headline Ideas for Developers\n\n1. **Crafting digital ecosystems where design meets intelligent engineering.**\n2. **Full-stack engineer building premium SaaS interfaces & AI tools.**\n3. **Transforming complex workflows into calm, intuitive digital experiences.**\n\n### Value Proposition Note:\nEmphasize the transition from standard chatbots to SaaS-grade AI workspaces (like Orenda Vault) to stand out to engineering leaders!`,
    summary: 'Drafting 3 modern value propositions for personal portfolio redesign.',
    category: 'Portfolio Hero Copy',
    collectionId: 'col-1',
    isFavorite: true,
    isTrashed: false,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'note-3',
    title: 'React 19 Server Actions & Hooks Guide',
    content: `# Modern React 19 Patterns\n\nWith React 19, \`useTransition\` and Server Actions make optimistic UI updates cleaner than ever.\n\n\`\`\`tsx\nimport { useActionState } from 'react';\n\nasync function updateName(previousState, formData) {\n  return await updateNameInDb(formData.get("name"));\n}\n\`\`\`\n\nKey takeaways: Always use strict TypeScript boundaries and avoid redundant useEffect polling when native actions are available.`,
    summary: 'Overview of React 19 Server Actions and optimistic UI updates.',
    category: 'React Notes',
    collectionId: 'col-2',
    isFavorite: false,
    isTrashed: false,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 1,
  },
];

export const INITIAL_CHAT_MESSAGES: WorkspaceChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: `Welcome to *Orenda Vault* — your intelligent second brain.

Create, discover, and organize your *notes and collections* through natural conversation.

What’s on your mind?`,
    timestamp: Date.now() - 60000,
  },
];
