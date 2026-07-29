'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Collection } from '@/types/workspace';
import { Sparkles, Folder } from 'lucide-react';
import { Select, Form, ConfigProvider } from 'antd';
import { Input, TextArea } from '@/components/ui/Input';

export interface QuickNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: {
    title: string;
    content: string;
    category?: string;
    collectionId?: string;
  }) => void;
  collections: Collection[];
  initialTitle?: string;
  initialContent?: string;
}

export const QuickNoteModal: React.FC<QuickNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  collections,
  initialTitle = '',
  initialContent = '',
}) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [content, setContent] = useState<string>(initialContent);

  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    const col = collections.find(c => c.id === selectedCollectionId);

    onSave({
      title: title.trim() || 'Quick Note',
      content: content.trim(),
      category: col ? col.name : 'General Notes',
      collectionId: selectedCollectionId || undefined,
    });

    // Reset and close
    setTitle('');
    setContent('');
    setSelectedCollectionId('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Note" maxWidth="max-w-xl">
      <Form layout="vertical" className="space-y-3" onSubmitCapture={(e) => { e.preventDefault(); handleSave(); }}>
        <Form.Item className="mb-3">
          <Input
            size="large"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title (e.g. React 19 Action Notes)"
            className="font-semibold text-lg"
            autoFocus
          />
        </Form.Item>

        <Form.Item className="mb-3">
          <TextArea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Jot down thoughts, code snippets, or meeting takeaways... Markdown is supported!"
            className="font-mono text-sm leading-relaxed"
          />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Form.Item
            label={
              <span className="text-xs font-semibold text-[#0f3d3e] flex items-center gap-1">
                <Folder className="w-3.5 h-3.5" /> Save to Collection
              </span>
            }
            className="mb-2"
          >
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#0F4C3A',
                  colorText: '#0f3d3e',
                  borderRadius: 12,
                },
              }}
            >
              <Select
                value={selectedCollectionId}
                onChange={(val) => setSelectedCollectionId(val)}
                placeholder="Select a collection"
                className="w-full"
                options={[
                  { value: '', label: 'No Collection (General)' },
                  ...collections.map(col => ({ value: col.id, label: col.name }))
                ]}
              />
            </ConfigProvider>
          </Form.Item>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#0f3d3e]/10">
          <span className="text-[11px] text-[#4B5563] flex items-center gap-1">
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="accent" size="sm" onClick={handleSave} type="button">
              Save
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
