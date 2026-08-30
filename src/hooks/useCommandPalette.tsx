'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import React from 'react';
import {
  FileText,
  Folder,
  Plus,
  Sparkles,
  Star,
  Clock,
  LayoutDashboard,
  BookOpen,
} from 'lucide-react';
import {
  CommandPaletteItemData,
  CommandPaletteModalProps,
} from '@/components/ui/command-palette/commandPalette.type';

export function useCommandPalette({
  onClose,
  notes,
  collections,
  onSelectView,
  onSelectNote,
  onSelectCollection,
  onNewNote,
}: Omit<CommandPaletteModalProps, 'isOpen'>) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const defaultActions: CommandPaletteItemData[] = useMemo(
    () => [
      {
        id: 'action-new-note',
        category: 'actions',
        title: 'Create New Note',
        subtitle: 'Capture ideas quickly into your vault',
        icon: <Plus className="w-4 h-4" />,
        onSelect: () => {
          onClose();
          onNewNote?.();
        },
      },
      {
        id: 'action-dashboard',
        category: 'actions',
        title: 'Go to Dashboard',
        subtitle: 'Overview of your workspace',
        icon: <LayoutDashboard className="w-4 h-4" />,
        onSelect: () => {
          onClose();
          onSelectView('dashboard');
        },
      },
      {
        id: 'action-notes',
        category: 'actions',
        title: 'All Notes',
        subtitle: 'Browse all notes in knowledge base',
        icon: <BookOpen className="w-4 h-4" />,
        onSelect: () => {
          onClose();
          onSelectView('notes');
        },
      },
      {
        id: 'action-collections',
        category: 'actions',
        title: 'View Collections',
        subtitle: 'Organized folders and topic groups',
        icon: <Folder className="w-4 h-4" />,
        onSelect: () => {
          onClose();
          onSelectView('collections');
        },
      },
      {
        id: 'action-favorites',
        category: 'actions',
        title: 'Starred & Favorites',
        subtitle: 'Quick access to important notes',
        icon: <Star className="w-4 h-4" />,
        onSelect: () => {
          onClose();
          onSelectView('favorites');
        },
      },
      {
        id: 'action-recent',
        category: 'actions',
        title: 'Recent Activity',
        subtitle: 'Recently modified files and notes',
        icon: <Clock className="w-4 h-4" />,
        onSelect: () => {
          onClose();
          onSelectView('recent');
        },
      },
      {
        id: 'action-chat',
        category: 'actions',
        title: 'Ask AI Knowledge Assistant',
        subtitle: 'Retrieve & summarize notes using AI',
        icon: <Sparkles className="w-4 h-4" />,
        onSelect: () => {
          onClose();
          onSelectView('chat');
        },
      },
    ],
    [onClose, onNewNote, onSelectView]
  );

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    const actions = defaultActions.filter(
      (item) =>
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q)
    );

    const noteItems: CommandPaletteItemData[] = notes
      .filter(
        (n) =>
          !q ||
          n.title.toLowerCase().includes(q) ||
          n.content?.toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map((n) => {
        const rawContent = n.summary || n.content || '';
        const cleanContent = rawContent
          ? rawContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
          : 'Empty note';

        return {
          id: `note-${n.id}`,
          category: 'notes',
          title: n.title || 'Untitled Note',
          subtitle: cleanContent.slice(0, 80) || 'Empty note',
          badge: n.category || 'Note',
          icon: <FileText className="w-4 h-4" />,
          onSelect: () => {
            onClose();
            if (onSelectNote) {
              onSelectNote(n);
            } else {
              onSelectView('notes');
            }
          },
        };
      });

    const collectionItems: CommandPaletteItemData[] = collections
      .filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((c) => ({
        id: `col-${c.id}`,
        category: 'collections',
        title: c.name,
        subtitle: c.description || `${c.noteCount} notes`,
        badge: `${c.noteCount} notes`,
        icon: <Folder className="w-4 h-4" />,
        onSelect: () => {
          onClose();
          if (onSelectCollection) {
            onSelectCollection(c.id);
          } else {
            onSelectView('collections');
          }
        },
      }));

    return {
      actions,
      notes: noteItems,
      collections: collectionItems,
      all: [...actions, ...noteItems, ...collectionItems],
    };
  }, [query, defaultActions, notes, collections, onClose, onSelectNote, onSelectCollection, onSelectView]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const total = filteredItems.all.length;
      if (total === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % total);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + total) % total);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems.all[activeIndex]) {
          filteredItems.all[activeIndex].onSelect();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [filteredItems.all, activeIndex, onClose]
  );

  return {
    query,
    setQuery,
    activeIndex,
    setActiveIndex,
    filteredItems,
    handleKeyDown,
  };
}
