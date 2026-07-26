import { Trash2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

export function DeleteChatButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50/50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
      title="Delete Chat"
      {...props}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
