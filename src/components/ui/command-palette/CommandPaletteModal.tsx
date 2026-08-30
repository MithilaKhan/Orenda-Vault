'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX } from 'lucide-react';
import { CommandPaletteModalProps } from './commandPalette.type';
import { CommandPaletteHeader } from './CommandPaletteHeader';
import { CommandPaletteSection } from './CommandPaletteSection';
import { CommandPaletteItem } from './CommandPaletteItem';
import { useCommandPalette } from '@/hooks/useCommandPalette';

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = (props) => {
  const { isOpen, onClose, initialQuery } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    setQuery,
    activeIndex,
    setActiveIndex,
    filteredItems,
    handleKeyDown,
  } = useCommandPalette(props);

  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setQuery(initialQuery);
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen, initialQuery, setQuery]);

  let globalIndexCounter = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4"
          onKeyDown={handleKeyDown}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f3d3e]/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#F7F3EA] border border-[#0f3d3e]/15 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh]"
          >
            <CommandPaletteHeader
              query={query}
              onQueryChange={setQuery}
              onClose={onClose}
              inputRef={inputRef}
            />

            <div className="flex-1 overflow-y-auto p-2 space-y-1 pb-4">
              {filteredItems.all.length === 0 ? (
                <div className="py-12 text-center text-[#0f3d3e]/60 flex flex-col items-center gap-2 select-none">
                  <SearchX className="w-8 h-8 text-[#0f3d3e]/40" />
                  <p className="text-sm font-medium">No results found for "{query}"</p>
                  <p className="text-xs text-[#0f3d3e]/40">Try searching for notes, collections, or quick actions.</p>
                </div>
              ) : (
                <>
                  {filteredItems.actions.length > 0 && (
                    <CommandPaletteSection title="Quick Actions">
                      {filteredItems.actions.map((item) => {
                        const currentIndex = globalIndexCounter++;
                        return (
                          <CommandPaletteItem
                            key={item.id}
                            item={item}
                            isActive={activeIndex === currentIndex}
                            onSelect={item.onSelect}
                            onMouseEnter={() => setActiveIndex(currentIndex)}
                          />
                        );
                      })}
                    </CommandPaletteSection>
                  )}

                  {filteredItems.notes.length > 0 && (
                    <CommandPaletteSection title="Notes">
                      {filteredItems.notes.map((item) => {
                        const currentIndex = globalIndexCounter++;
                        return (
                          <CommandPaletteItem
                            key={item.id}
                            item={item}
                            isActive={activeIndex === currentIndex}
                            onSelect={item.onSelect}
                            onMouseEnter={() => setActiveIndex(currentIndex)}
                          />
                        );
                      })}
                    </CommandPaletteSection>
                  )}

                  {filteredItems.collections.length > 0 && (
                    <CommandPaletteSection title="Collections">
                      {filteredItems.collections.map((item) => {
                        const currentIndex = globalIndexCounter++;
                        return (
                          <CommandPaletteItem
                            key={item.id}
                            item={item}
                            isActive={activeIndex === currentIndex}
                            onSelect={item.onSelect}
                            onMouseEnter={() => setActiveIndex(currentIndex)}
                          />
                        );
                      })}
                    </CommandPaletteSection>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
