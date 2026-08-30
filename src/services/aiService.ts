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
    systemContext: string = 'You are Orenda AI, a calm, intelligent AI assistant inside Orenda Vault, a modern creative workspace and second brain.'
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
    const res = await this.generateResponse(
      `Summarize the following notes into 3 concise bullet points with actionable takeaways:\n\n${text}`,
      [],
      'You are an expert summarizer. Return clean markdown bullet points.'
    );
    return res.content;
  }
};

