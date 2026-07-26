import { ButtonHTMLAttributes } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface GenerateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function GenerateButton({ loading, className = "", ...props }: GenerateButtonProps) {
  return (
    <button
      className={`flex items-center justify-center gap-2 bg-linear-to-r from-primary to-[#185A5B] text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(163,255,18,0.3)] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Sparkles className="w-5 h-5 text-accent" />
      )}
      <span>{loading ? "Generating..." : "Generate"}</span>
    </button>
  );
}
