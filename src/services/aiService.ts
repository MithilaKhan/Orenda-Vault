import { myFetch } from '@/helpers/myFetch';

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

  async summarizeText(text: string): Promise<string> {
    const res = await this.generateResponse(
      `Summarize the following notes into 3 concise bullet points with actionable takeaways:\n\n${text}`,
      [],
      'You are an expert summarizer. Return clean markdown bullet points.'
    );
    return res.content;
  }
};
