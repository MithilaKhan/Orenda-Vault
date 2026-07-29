export interface AIResponseResult {
  content: string;
  success: boolean;
  error?: string;
}

export interface AIServiceInterface {
  generateResponse(
    prompt: string, 
    history?: { role: string; content: string }[],
    systemContext?: string
  ): Promise<AIResponseResult>;
  summarizeText(text: string): Promise<string>;
  getOfflineFallback(prompt: string): string;
}
