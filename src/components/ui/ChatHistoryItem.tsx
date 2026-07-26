import { MessageSquare } from "lucide-react";
import { DeleteChatButton } from "./DeleteChatButton";

interface ChatHistoryItemProps {
  title: string;
  date: string;
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export function ChatHistoryItem({ title, date, isActive, onClick, onDelete }: ChatHistoryItemProps) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-[rgba(163,255,18,0.15)] text-primary font-medium"
          : "hover:bg-[rgba(15,61,62,0.05)] text-primary/80"
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-primary/50"}`} />
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm truncate w-full">{title}</span>
          <span className="text-[10px] text-primary/40 mt-0.5">{date}</span>
        </div>
      </div>
      
      <DeleteChatButton onClick={onDelete} />
    </div>
  );
}
