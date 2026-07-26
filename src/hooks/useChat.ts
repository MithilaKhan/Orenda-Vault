import { useState, useEffect, MouseEvent } from "react";

export type Message = { id: string; role: "user" | "ai"; content: string };
export type ChatHistory = { id: string; title: string; date: string };

export function useChat() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    const rH = localStorage.getItem("o_hist"), rC = localStorage.getItem("o_chats"), rA = localStorage.getItem("o_act");
    const timer = setTimeout(() => {
      if (rH) setHistory(JSON.parse(rH));
      if (rC) setChats(JSON.parse(rC));
      if (rA) setActiveChatId(rA);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const save = (h: ChatHistory[], c: Record<string, Message[]>, a: string | null) => {
    localStorage.setItem("o_hist", JSON.stringify(h));
    localStorage.setItem("o_chats", JSON.stringify(c));
    if (a) localStorage.setItem("o_act", a); else localStorage.removeItem("o_act");
  };

  const handleNewChat = () => { setActiveChatId(null); setPrompt(""); localStorage.removeItem("o_act"); };

  const handleDeleteChat = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const nextH = history.filter(c => c.id !== id), nextC = { ...chats };
    delete nextC[id];
    const nextA = activeChatId === id ? null : activeChatId;
    setHistory(nextH); setChats(nextC); setActiveChatId(nextA); save(nextH, nextC, nextA);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    const id = activeChatId || Date.now().toString();
    let nextH = history;
    if (!activeChatId) {
      nextH = [{ id, title: prompt.slice(0, 25) + "...", date: "Just now" }, ...history];
      setHistory(nextH); setActiveChatId(id);
    }
    const current = prompt; setPrompt("");
    const userMsg: Message = { id: Date.now() + "-u", role: "user", content: current };
    const stepC = { ...chats, [id]: [...(chats[id] || []), userMsg] };
    setChats(stepC); setLoading(true);
    try {
      const res = await import("@/services/aiService").then(m => m.aiService.generateResponse(current));
      const aiMsg: Message = { id: Date.now() + "-a", role: "ai", content: res.content || "Error." };
      const finalC = { ...stepC, [id]: [...stepC[id], aiMsg] };
      setChats(finalC); save(nextH, finalC, id);
    } catch {
      const errMsg: Message = { id: Date.now() + "-e", role: "ai", content: "Failed to connect." };
      const errC = { ...stepC, [id]: [...stepC[id], errMsg] };
      setChats(errC); save(nextH, errC, id);
    } finally { setLoading(false); }
  };

  return {
    prompt, setPrompt, loading, history, activeChatId,
    currentMessages: activeChatId ? chats[activeChatId] || [] : [],
    handleNewChat, handleDeleteChat, handleGenerate,
    handleSelectChat: (id: string) => { setActiveChatId(id); localStorage.setItem("o_act", id); },
    handleSuggestionClick: (sug: string) => setPrompt(sug),
  };
}
