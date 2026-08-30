import { WorkspaceStore } from '@/store/useWorkspaceStore';
import { aiService } from '@/services/aiService';

export const useWorkspaceAI = (store: WorkspaceStore, refreshWorkspaceData?: () => void) => {

  const handleTriggerAITool = async (toolId: string, prompt: string) => {
    store.setActiveView('chat');
    store.addChatMessage({ role: 'user', content: `Tool Action: **${toolId.toUpperCase()}**\n\n${prompt}` });
    store.setIsAiLoading(true);

    try {
      const res = await aiService.generateResponse(prompt, store.chatMessages);
      store.addChatMessage({ role: 'assistant', content: res.content });
      if (res.toolResult && refreshWorkspaceData) {
        refreshWorkspaceData();
      }
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
      if (res.toolResult && refreshWorkspaceData) {
        refreshWorkspaceData();
      }
    } catch {
      store.addChatMessage({ role: 'assistant', content: 'An unexpected error occurred.' });
    } finally {
      store.setIsAiLoading(false);
    }
  };

  const handleFetchHistory = async () => {
    store.setIsHistoryLoading(true);
    try {
      const res = await aiService.getChatHistory();
      if (res.success && res.data && res.data.length > 0) {
        const formatted = res.data.map((msg: any, idx: number) => ({
          id: msg._id || `msg-${idx}-${Date.now()}`,
          role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now(),
        }));
        store.setChatMessages(formatted);
      } else {
        store.setChatMessages([]);
      }
    } catch {
      store.setChatMessages([]);
    } finally {
      store.setIsHistoryLoading(false);
    }
  };



  const handleClearHistory = async () => {
    await aiService.clearChatHistory();
    store.clearChatHistory();
  };

  return {
    handleTriggerAITool,
    handleSendAI,
    handleFetchHistory,
    handleClearHistory,
  };
};

