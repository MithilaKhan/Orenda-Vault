import Image from "next/image";
import { Plus } from "lucide-react";
import { ChatHistoryItem } from "../ui/ChatHistoryItem";
import { ChatHistory } from "../../hooks/useChat";

interface ChatSidebarProps {
  history: ChatHistory[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
}

export function ChatSidebar({
  history,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: ChatSidebarProps) {
  return (
    <div className="w-72 bg-sidebar-bg border-r border-border-color h-full flex-col hidden md:flex shrink-0">
      <div className="flex items-center gap-2 p-4 mt-5 mb-2">
        {/* Real PNG logo – overflow-hidden crops background padding */}
        <span className="inline-flex items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-[rgba(15,61,62,0.2)] flex-shrink-0" style={{ width: 48, height: 48 }}>
          <Image src="/logo-mockup.png" alt="Orenda Vault Logo" width={77} height={77} style={{ objectFit: 'cover', width: 77, height: 77 }} priority />
        </span>
        <h2 className="text-xl font-semibold text-primary/90">Orenda Vault</h2>
      </div>
      
      <div className="p-4 pt-0">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 bg-white/60 hover:bg-white/80 text-primary border border-border-color px-4 py-3 rounded-xl shadow-sm transition-all duration-200 group cursor-pointer"
        >
          <div className="p-1 rounded-md bg-accent">
            <Plus className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-sm">New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="px-2 pb-2 text-xs font-semibold text-primary/80 uppercase tracking-wider">Recent</div>
        {history.length === 0 ? (
          <div className="px-3 py-4 text-sm text-primary/50 italic text-center">No previous chats</div>
        ) : (
          history.map((chat) => (
            <ChatHistoryItem
              key={chat.id}
              title={chat.title}
              date={chat.date}
              isActive={chat.id === activeChatId}
              onClick={() => onSelectChat(chat.id)}
              onDelete={(e) => onDeleteChat(chat.id, e)}
            />
          ))
        )}
      </div>

      <div className="p-4 border-t border-border-color">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center overflow-hidden rounded-full flex-shrink-0" style={{ width: 40, height: 40 }}>
            <Image src="/logo-mockup.png" alt="Orenda Vault" width={64} height={64} style={{ objectFit: 'cover', width: 64, height: 64 }} priority />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-primary">Orenda Vault</span>
            <span className="text-xs text-primary/60">Manage account</span>
          </div>
        </div>
      </div>
    </div>
  );
}
