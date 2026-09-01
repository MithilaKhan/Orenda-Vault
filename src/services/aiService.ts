import { myFetch } from '@/helpers/myFetch';

export interface AIResponseResult {
  content: string;
  success: boolean;
  toolResult?: any;
  error?: string;
}

export const aiService = {
  async generateResponse(
    prompt: string, 
    history: { role: string; content: string }[] = [],
    systemContext: string = 'You are Orenda AI, a calm, intelligent AI assistant inside Orenda Vault, a modern creative workspace and second brain. Always respond in the EXACT same language as the user input (Bangla, Banglish, or English).'
  ): Promise<AIResponseResult> {
    try {
      const messages = [
        { role: 'system', content: systemContext },
        ...history.map(m => ({
          role: m.role === 'ai' || m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        })),
        { role: 'user', content: prompt }
      ];

      const response = await myFetch('/chat/send', {
        method: 'POST',
        body: { messages },
      });

      if (response.success && response.data) {
        return { 
          content: response.data.text || 'Processing completed.', 
          toolResult: response.data.toolResult || null,
          success: true 
        };
      } else {
        throw new Error(response.message || response.error || 'Failed to connect to AI server');
      }
    } catch (err) {
      console.warn('Backend AI call failed:', err);
      return {
        content: err instanceof Error ? err.message : 'Failed to generate response.',
        success: false,
      };
    }
  },

  async getChatHistory() {
    try {
      const response = await myFetch('/chat/history', {
        method: 'GET',
      });
      if (response.success && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data,
        };
      }
      return { success: false, data: [] };
    } catch (err) {
      console.warn('Failed to fetch chat history:', err);
      return { success: false, data: [] };
    }
  },

  async clearChatHistory() {
    try {
      const response = await myFetch('/chat/clear', {
        method: 'DELETE',
      });
      return {
        success: response.success,
        message: response.message || 'Chat history cleared',
      };
    } catch (err) {
      console.warn('Failed to clear chat history:', err);
      return { success: false, message: 'Failed to clear chat history' };
    }
  },

  async summarizeText(text: string): Promise<string> {
    const systemPrompt = `You are an expert knowledge analyst and summarizer for Orenda Vault, a premium knowledge workspace. Your summaries should be on par with the best AI assistants (ChatGPT, Claude).

Rules:
- LANGUAGE MATCHING (CRITICAL): Always respond in the EXACT same language as the input content.
  * If input is in Bangla (বাংলা), write the entire summary in Bangla.
  * If input is in Banglish (Bangla using English script), write in Banglish.
  * If input is in English, write in English.
- Analyze the content deeply — don't just extract surface-level points
- Identify the CORE thesis, key insights, and actionable takeaways
- Use clean, professional markdown formatting
- Be concise but never lose critical nuance
- If the content contains code, explain what it does in plain language
- If the content is a meeting note, extract decisions and action items
- Adapt your summary style to the content type (technical, creative, business, etc.)

Output format (translate headers to match the input language if appropriate, e.g., **সারসংক্ষেপ** / **Summary**):
**Summary** (or **সারসংক্ষেপ** for Bangla)
A 1-2 sentence overview of what this content is about.

**Key Points** (or **মূল বিষয়বস্তু** for Bangla)
- Point 1
- Point 2
- Point 3

**Takeaways** (or **সিদ্ধান্ত/শিক্ষণীয়** for Bangla)
- What to do next or remember`;

    const res = await this.generateResponse(
      `Summarize the following content in its original language with depth and precision:\n\n${text}`,
      [],
      systemPrompt
    );
    return res.content;
  }
};

