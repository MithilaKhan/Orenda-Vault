'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '@/types/workspace';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { Form } from 'antd';

export interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onSave: (id: string, partial: Partial<Note>) => void;
}

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  onClose,
  note,
  onSave,
}) => {
  const [editTitle, setEditTitle] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');

  useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
    }
  }, [note, isOpen]);

  const handleSaveEdit = () => {
    if (!note) return;
    onSave(note.id, {
      title: editTitle,
      content: editContent,
      summary: editContent.slice(0, 100) + '...',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={note ? `Edit Note: ${note.title}` : 'Edit Note'}
      maxWidth="max-w-2xl"
    >
      <Form layout="vertical" className="space-y-4" onSubmitCapture={(e) => { e.preventDefault(); handleSaveEdit(); }}>
        <Form.Item label={<span className="text-xs font-semibold uppercase tracking-wider text-[#0f3d3e]">Title</span>}>
          <Input
            size="large"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-semibold text-base"
          />
        </Form.Item>

        <Form.Item label={<span className="text-xs font-semibold uppercase tracking-wider text-[#0f3d3e]">Markdown Content</span>}>
          <TextArea
            rows={8}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="font-mono text-sm leading-relaxed"
            placeholder="Write your note content..."
          />
        </Form.Item>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0f3d3e]/10">
          <Button variant="secondary" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSaveEdit} type="button">
            Save Note
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
