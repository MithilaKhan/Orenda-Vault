'use client';

import React from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';

interface BottomCommandBarProps {
  isCollapsed: boolean;
  onOpenPalette: () => void;
  floatingPrompt: string;
  setFloatingPrompt: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BottomCommandBar: React.FC<BottomCommandBarProps> = ({
  isCollapsed,
  onOpenPalette,
  floatingPrompt,
  setFloatingPrompt,
  onSubmit,
}) => {
  return (
    <div
      className={`fixed bottom-6 left-0 right-0 z-20 px-4 transition-all duration-300 ${isCollapsed ? 'lg:pl-24' : 'lg:pl-68'
        } lg:pr-8`}
    >
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={onSubmit}
          onClick={onOpenPalette}
          className="bg-white/90 backdrop-blur-xl border border-[#0f3d3e]/15 rounded-2xl shadow-2xl p-2 flex items-center gap-2.5 focus-within:border-[#0F4C3A] focus-within:ring-2 focus-within:ring-[#0F4C3A]/30 transition-all cursor-pointer group"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenPalette();
            }}
            className=" rounded-xl border border-[#0F4C3A]/15 shrink-0 flex items-center justify-center overflow-hidden w-9 h-9 shadow-soft hover:bg-[#0F4C3A]/20 transition-colors"
            title="Open Command Palette"
          >
            <Image
              src="/logo-mockup.png"
              alt="Orenda Vault"
              width={28}
              height={28}
              className="rounded-lg object-cover"
            />
          </button>

          <input
            readOnly
            value={floatingPrompt}
            placeholder="Search notes, collections, or type a command..."
            className="w-full border-none shadow-none bg-transparent text-sm text-[#0f3d3e] placeholder:text-[#4B5563]/60 cursor-pointer outline-none"
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenPalette();
            }}
            className="p-2.5 rounded-xl bg-[#0F4C3A] text-[#F7F3EA] hover:bg-[#0F4C3A]/90 transition-all active:scale-95 shadow-soft flex-shrink-0"
            title="Search Knowledge"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
