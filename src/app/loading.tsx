import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground animate-in fade-in duration-300">
      <div className="relative w-20 h-20 flex items-center justify-center mb-6">
        <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
        <div className="absolute inset-0 border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        {/* Crop the PNG's built-in background padding via overflow-hidden */}
        <span className="inline-flex items-center justify-center overflow-hidden rounded-full animate-pulse" style={{ width: 44, height: 44 }}>
          <Image
            src="/logo-mockup.png"
            alt="Orenda AI"
            width={70}
            height={70}
            style={{ objectFit: 'cover', width: 70, height: 70 }}
            priority
          />
        </span>
      </div>
      <p className="text-sm font-semibold tracking-wider text-primary/75 uppercase animate-pulse">
        Loading your vault...
      </p>
    </div>
  );
}
