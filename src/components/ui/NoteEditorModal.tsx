'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '@/types/workspace';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Form } from 'antd';
import { Sparkles, Loader2, X } from 'lucide-react';
import { aiService } from '@/services/aiService';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
  loading: () => <div className="h-[300px] border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center text-sm text-gray-400">Loading Editor...</div>
});

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
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [summaryPreview, setSummaryPreview] = useState<string>('');

  const editorConfig = React.useMemo(() => ({
    readonly: false,
    placeholder: 'Write your note content...',
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'paragraph', '|',
      'image', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'fullsize'
    ],
    uploader: {
      insertImageAsBase64URI: true
    },
    height: 300,
    minHeight: 220
  }), []);

  useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setSummaryPreview('');
    }
  }, [note, isOpen]);

  const handleSaveEdit = () => {
    if (!note) return;
    onSave(note.id, {
      title: editTitle,
      content: editContent,
      summary: editContent.replace(/<[^>]*>/g, '').slice(0, 100) + '...',
    });
    onClose();
  };

  const handleSummarize = async () => {
    if (!editContent.trim()) {
      toast.error('Nothing to summarize');
      return;
    }
    setIsSummarizing(true);
    setSummaryPreview('');
    try {
      const plainText = editContent.replace(/<[^>]*>/g, '').trim();
      const result = await aiService.summarizeText(plainText);
      if (result && !result.includes('Failed to')) {
        setSummaryPreview(result);
      } else {
        toast.error('Unable to generate summary');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleUseSummary = () => {
    if (!note || !summaryPreview) return;
    // Update the note's summary/description with the AI summary
    onSave(note.id, { summary: summaryPreview });
    toast.success('Description updated with AI summary');
    setSummaryPreview('');
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

        <Form.Item label={<span className="text-xs font-semibold uppercase tracking-wider text-[#0f3d3e]">Note Content</span>}>
          <JoditEditor
            value={editContent}
            config={editorConfig}
            onBlur={(newContent) => setEditContent(newContent)}
            onChange={() => {}}
          />
        </Form.Item>

        {/* AI Summary Preview */}
        {summaryPreview && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F4C3A]/5 via-white to-[#A8E063]/10 border border-[#0F4C3A]/15 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0F4C3A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Summary Preview
              </span>
              <button
                onClick={() => setSummaryPreview('')}
                className="p-1 rounded-lg hover:bg-[#0f3d3e]/5 transition-colors"
                type="button"
              >
                <X className="w-3.5 h-3.5 text-[#4B5563]" />
              </button>
            </div>
            <div
              className="text-sm text-[#0f3d3e] leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: summaryPreview
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br/>')
              }}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleUseSummary}
              type="button"
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Use as Description
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[#0f3d3e]/10">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSummarize}
            disabled={isSummarizing || !editContent.trim()}
            type="button"
            icon={isSummarizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          >
            {isSummarizing ? 'Summarizing...' : 'Summarize'}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveEdit} type="button">
              Save Note
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
