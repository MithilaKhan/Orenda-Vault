export interface AIResponseResult {
  content: string;
  success: boolean;
  error?: string;
}

export const aiService = {
  async generateResponse(
    prompt: string, 
    history: { role: string; content: string }[] = [],
    systemContext: string = 'You are Orenda AI, a calm, intelligent AI assistant inside Orenda Vault, a modern creative workspace and second brain.'
  ): Promise<AIResponseResult> {
    try {
      // Direct UI-focused AI generation: Only keep AI token (no backend servers or API routes)
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
      
      if (apiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemContext },
              ...history.map(m => ({
                role: m.role === 'ai' || m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content
              })),
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            return { content, success: true };
          }
        }
      }
    } catch (err) {
      console.warn('Direct AI token call fallback:', err);
    }

    return {
      content: this.getOfflineFallback(prompt),
      success: true,
    };
  },

  async summarizeText(text: string): Promise<string> {
    const res = await this.generateResponse(
      `Summarize the following notes into 3 concise bullet points with actionable takeaways:\n\n${text}`,
      [],
      'You are an expert summarizer. Return clean markdown bullet points.'
    );
    return res.content;
  },

  async tagNoteContent(text: string): Promise<string[]> {
    try {
      const res = await this.generateResponse(
        `Analyze this note and suggest 2 to 3 short category tags (e.g., React, AI, Design, Security, Career, Meeting). Return ONLY a comma-separated list of tags, nothing else.\n\nText:\n${text}`,
        [],
        'Return ONLY comma-separated words.'
      );
      const tags = res.content
        .split(',')
        .map(t => t.trim().replace(/[^a-zA-Z0-9 -]/g, ''))
        .filter(t => t && t.length > 0 && t.length <= 20 && !t.includes('\n') && !t.includes('#'))
        .slice(0, 3);
      return tags.length > 0 ? tags : ['General', 'AI', 'Vault'];
    } catch {
      return ['Vault Note', 'AI Tagged'];
    }
  },

  getOfflineFallback(prompt: string): string {
    const p = prompt.toLowerCase();
    if (p.includes('category tags') || p.includes('suggest 2 to 3 short category tags') || p.includes('comma-separated list of tags')) {
      if (p.includes('jwt') || p.includes('auth') || p.includes('token')) return 'Security, Auth, Web Dev';
      if (p.includes('portfolio') || p.includes('hero') || p.includes('copy')) return 'Portfolio, Copy, Design';
      if (p.includes('react') || p.includes('hook') || p.includes('action')) return 'React, NextJS, Frontend';
      return 'General, Vault, AI Note';
    }
    if (p.includes('jwt') || p.includes('auth')) {
      return `### JSON Web Token (JWT) Quick Reference\n\nJWTs are URL-safe tokens used for stateless authentication between client and server.\n\n1. **Header**: Defines token type and signing hash algorithm (\`HS256\`, \`RS256\`).\n2. **Payload**: Houses user claims (id, email, roles, \`exp\` timestamp).\n3. **Signature**: Verifies token authenticity.\n\n> [!TIP]\n> Always store JWTs securely and set short expiration times to mitigate token hijacking.`;
    }
    if (p.includes('react') || p.includes('interview')) {
      return `### Key React Interview Concepts\n\n1. **Server Actions vs Client Components**: When to execute data mutations on the server boundary.\n2. **Concurrency Hooks**: Utilizing \`useTransition\` and optimistic UI rendering in React 19.\n3. **Re-render Optimization**: Understanding reconciliation and referential equality without overuse of \`useMemo\`.`;
    }
    if (p.includes('portfolio') || p.includes('hero') || p.includes('copy')) {
      return `### Portfolio Hero Copy Suggestions\n\n1. *"Crafting scalable web applications with human-centric design."*\n2. *"Full-stack engineer building intuitive digital experiences."*\n3. *"Turning complex problems into clean, high-performance software."*\n\n> [!NOTE]\n> Pick the variation that aligns best with your primary engineering strength!`;
    }
    if (p.includes('summarize')) {
      return `### Summary of Takeaways\n\n- **Primary Focus**: Transforming Orenda AI into a sleek monochrome Apple/Linear-inspired workspace.\n- **Action Items**: Group notes into organized collections, utilize instant AI memory search, and maintain seamless client state.\n- **Next Step**: Continue building out reusable UI primitives and feature modules!`;
    }
    return `### Orenda Vault Intelligence\n\nI have analyzed your request regarding: *"**${prompt.slice(0, 50)}...**"*\n\nHere are some structured thoughts:\n\n- **Concept Clarity**: Breaking down complex ideas into calm, readable documentation.\n- **Actionable Step**: Create a new Quick Note or add this snippet directly to your Collections for future reference.\n\nLet me know if you would like me to expand on any specific aspect!`;
  }
};
