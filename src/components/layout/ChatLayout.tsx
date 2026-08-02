import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatHistory } from "../../hooks/useChat";

interface ChatLayoutProps {
  children: ReactNode;
  history: ChatHistory[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
}

export function ChatLayout({
  children,
  history,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: ChatLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarProps = {
    history,
    activeChatId,
    onNewChat: () => { onNewChat(); setMobileMenuOpen(false); },
    onSelectChat: (id: string) => { onSelectChat(id); setMobileMenuOpen(false); },
    onDeleteChat,
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-background relative z-10">
      <ChatSidebar {...sidebarProps} />

      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-sidebar-bg/80 backdrop-blur-md border-b border-border-color z-50 flex items-center justify-between px-4">
        <span className="font-semibold text-primary">Orenda Vault</span>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-60 flex">
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 h-full bg-sidebar-bg shadow-2xl flex flex-col animate-in slide-in-from-left-full duration-300">
            <div className="h-14 border-b border-border-color flex items-center justify-end px-4">
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatSidebar {...sidebarProps} />
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col h-full relative pt-14 md:pt-0">{children}</main>
    </div>
  );
}
