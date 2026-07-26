import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background text-foreground overflow-hidden px-4 animate-in fade-in duration-500">
      {/* Giant Background 404 Watermark */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0">
        <span className="text-[14rem] sm:text-[22rem] md:text-[28rem] font-black text-primary/[0.04] leading-none tracking-tighter">
          404
        </span>
      </div>

      {/* Centered Content Card */}
      <div className="relative z-10 flex flex-col items-center max-w-md text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-primary mb-3 tracking-tight">
          Page not found
        </h1>
        <p className="text-sm md:text-base text-primary/70 mb-8 max-w-sm leading-relaxed">
          It seems the trail you followed has overgrown or doesn&apos;t exist. Let&apos;s find your way back to safety.
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 bg-primary hover:bg-[#185A5B] text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-[rgba(15,61,62,0.15)]"
        >
          Go to Home &rarr;
        </Link>
      </div>
    </div>
  );
}
