export type Message = { 
  id: string; 
  role: "user" | "ai"; 
  content: string; 
};

export type ChatHistory = { 
  id: string; 
  title: string; 
  date: string; 
};
