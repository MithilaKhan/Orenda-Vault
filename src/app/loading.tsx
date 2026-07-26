import { SiOverleaf } from "react-icons/si";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground animate-in fade-in duration-300">
      <div className="relative w-16 h-16 flex items-center justify-center mb-6">
        <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
        <div className="absolute inset-0 border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        <SiOverleaf className="w-6 h-6 text-primary animate-pulse" />
      </div>
      <p className="text-sm font-semibold tracking-wider text-primary/75 uppercase animate-pulse">
        Nurturing ideas...
      </p>
    </div>
  );
}
