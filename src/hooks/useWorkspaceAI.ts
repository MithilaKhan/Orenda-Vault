import { WorkspaceStore } from '@/store/useWorkspaceStore';
import { aiService } from '@/services/aiService';

export const useWorkspaceAI = (store: WorkspaceStore) => {

  const handleTriggerAITool = async (toolId: string, prompt: string) => {
    store.setActiveView('chat');
    store.addChatMessage({ role: 'user', content: `Tool Action: **${toolId.toUpperCase()}**\n\n${prompt}` });
    store.setIsAiLoading(true);

    try {
      const res = await aiService.generateResponse(prompt, store.chatMessages);
      store.addChatMessage({ role: 'assistant', content: res.content });
    } catch {
      store.addChatMessage({ role: 'assistant', content: 'I encountered an error executing this tool, but local fallback memory is active.' });
    } finally {
      store.setIsAiLoading(false);
    }
  };

  const handleSendAI = async (prompt: string) => {
    store.setActiveView('chat');
    store.addChatMessage({ role: 'user', content: prompt });
    store.setIsAiLoading(true);

    try {
      const res = await aiService.generateResponse(prompt, store.chatMessages);
      store.addChatMessage({ role: 'assistant', content: res.content });
    } catch {
      store.addChatMessage({ role: 'assistant', content: 'An unexpected error occurred.' });
    } finally {
      store.setIsAiLoading(false);
    }
  };

  return {
    handleTriggerAITool,
    handleSendAI
  };
};
