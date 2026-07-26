# Orenda AI 🌿

Orenda AI is a premium, nature-inspired AI content generator. Designed with a calming "forest green and soft sand" aesthetic, it provides users with a serene and distraction-free environment to explore the intersection of natural intelligence and artificial intelligence.

Built with modern web technologies, Orenda AI offers a seamless ChatGPT-style interface with a responsive layout, interactive message bubbles, and real-time content generation powered by the OpenAI API.

## ✨ Features

- **Premium UI/UX:** A highly polished, nature-themed design system emphasizing calm, focus, and creativity.
- **ChatGPT-Style Layout:** Familiar interface featuring a fixed collapsible sidebar for chat history and a sticky input area.
- **Real-Time Generation:** Seamless connection to the OpenAI API (model `gpt-4o-mini`) for fast and intelligent content creation.
- **Session Management:** Create new chats, switch between recent conversations, and manage history smoothly.
- **Local Persistence:** Chats and history are stored locally in the browser's `localStorage` so they persist across page refreshes.
- **Fully Responsive:** Optimized for both desktop and mobile devices, ensuring a premium experience on any screen size.
- **Interactive Elements:** Smooth transitions, hover effects, and custom-styled message bubbles with built-in lightweight markdown rendering.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Integration:** [OpenAI SDK](https://platform.openai.com/docs/api-reference)
- **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Language:** TypeScript
- **Package Manager:** [Yarn 4](https://yarnpkg.com/)

## 📂 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/generate/     # Backend API route handling OpenAI requests
│   │   ├── layout.tsx        # Global application layout and metadata
│   │   ├── page.tsx          # Main application page orchestrator
│   │   ├── loading.tsx       # Custom organic loading screen
│   │   └── not-found.tsx     # Custom organic 404 page
│   ├── components/
│   │   ├── layout/           # Structural layouts (Sidebar, main shell)
│   │   ├── chat/             # Composites (ChatWindow)
│   │   └── ui/               # Primitives (Input, message bubbles, buttons)
│   ├── hooks/
│   │   └── useChat.ts        # Custom react state controller with localStorage sync
│   └── styles/
│       └── globals.css       # Global styles and Tailwind configuration
└── package.json              # Project dependencies and script runner
```

## 🚀 Getting Started

First, clone the repository and install the dependencies using Yarn:

```bash
yarn install
```

Set up your environment variables by creating a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Run the development server:

```bash
yarn dev
```

Open [https://orenda-ai.vercel.app/](https://orenda-ai.vercel.app/) with your browser to see the result.

## 🎨 Design Philosophy

Orenda AI departs from the sterile, ultra-minimalist designs of standard AI tools. By utilizing earthy tones, subtle glassmorphism effects, and organic icons, it creates an environment that feels alive and inspiring—reducing cognitive load and encouraging pure creativity.
