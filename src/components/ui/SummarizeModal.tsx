'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/Input';
import { Sparkles, Copy, Check, Save, AlertCircle, Loader2 } from 'lucide-react';
import { aiService } from '@/services/aiService';
import toast from 'react-hot-toast';

export interface SummarizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAsNote: (noteData: { title: string; content: string }) => void;
}

export const SummarizeModal: React.FC<SummarizeModalProps> = ({
  isOpen,
  onClose,
  onSaveAsNote,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const handleSummarize = async () => {
    if (!inputText.trim() || inputText.trim().length < 20) {
      setError('Please paste at least a few sentences to summarize.');
      return;
    }

    setError('');
    setIsLoading(true);
    setSummary('');

    try {
      const result = await aiService.summarizeText(inputText.trim());
      if (result && !result.includes('Failed to')) {
        setSummary(result);
      } else {
        setError('Unable to generate summary. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setHasCopied(true);
      toast.success('Summary copied');
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleSaveAsNote = () => {
    const title = inputText.trim().split('\n')[0]?.slice(0, 60) || 'Summarized Content';
    onSaveAsNote({
      title: `Summary: ${title}`,
      content: `<h3>AI Summary</h3>\n${summary.replace(/\n/g, '<br/>')}\n\n<hr/>\n<h4>Original Content</h4>\n${inputText.replace(/\n/g, '<br/>')}`,
    });
    handleReset();
    onClose();
    toast.success('Note created from summary');
  };

  const handleReset = () => {
    setInputText('');
    setSummary('');
    setError('');
    setHasCopied(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="✨ Summarize Content" maxWidth="max-w-2xl">
      <div className="space-y-4">
        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#0f3d3e] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0F4C3A]" />
            Paste your content
          </label>
          <TextArea
            rows={6}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (error) setError('');
            }}
            placeholder="Paste any text here — articles, meeting notes, emails, documentation, code explanations...&#10;&#10;AI will analyze and extract a concise, actionable summary."
            className="text-sm leading-relaxed"
            disabled={isLoading}
          />
          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
        </div>

        {/* Summarize Button */}
        {!summary && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleSummarize}
            disabled={isLoading || !inputText.trim()}
            className="w-full"
            icon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          >
            {isLoading ? 'Analyzing & summarizing...' : 'Summarize'}
          </Button>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-[#0F4C3A]/20 border-t-[#0F4C3A] animate-spin" />
                <Sparkles className="w-4 h-4 text-[#0F4C3A] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xs text-[#4B5563] font-medium animate-pulse">
                AI is analyzing your content...
              </p>
            </div>
          </div>
        )}

        {/* Summary Result */}
        {summary && !isLoading && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0F4C3A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Summary
              </span>
              <span className="text-[10px] text-[#4B5563] font-medium px-2 py-0.5 rounded-full bg-[#A8E063]/20">
                Generated
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F4C3A]/5 via-white to-[#A8E063]/10 border border-[#0F4C3A]/15 shadow-sm">
              <div
                className="text-sm text-[#0f3d3e] leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none
                  [&_strong]:text-[#0F4C3A] [&_strong]:font-bold
                  [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1
                  [&_li]:text-[#0f3d3e]"
                dangerouslySetInnerHTML={{
                  __html: summary
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n- /g, '\n• ')
                    .replace(/\n/g, '<br/>')
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#0f3d3e]/10">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setSummary(''); setError(''); }}
              >
                Regenerate
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  icon={hasCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {hasCopied ? 'Copied' : 'Copy'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveAsNote}
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  Save as Note
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
