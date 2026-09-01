'use client';

import React, { useState, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { Collection } from '@/types/workspace';
import { Code2, Folder, ChevronDown } from 'lucide-react';
import { Select, Form, ConfigProvider } from 'antd';

const LANGUAGES = [
  { value: 'typescript', label: 'TypeScript', ext: 'ts' },
  { value: 'javascript', label: 'JavaScript', ext: 'js' },
  { value: 'python', label: 'Python', ext: 'py' },
  { value: 'html', label: 'HTML', ext: 'html' },
  { value: 'css', label: 'CSS', ext: 'css' },
  { value: 'java', label: 'Java', ext: 'java' },
  { value: 'csharp', label: 'C#', ext: 'cs' },
  { value: 'cpp', label: 'C++', ext: 'cpp' },
  { value: 'go', label: 'Go', ext: 'go' },
  { value: 'rust', label: 'Rust', ext: 'rs' },
  { value: 'php', label: 'PHP', ext: 'php' },
  { value: 'ruby', label: 'Ruby', ext: 'rb' },
  { value: 'swift', label: 'Swift', ext: 'swift' },
  { value: 'kotlin', label: 'Kotlin', ext: 'kt' },
  { value: 'sql', label: 'SQL', ext: 'sql' },
  { value: 'bash', label: 'Bash / Shell', ext: 'sh' },
  { value: 'json', label: 'JSON', ext: 'json' },
  { value: 'yaml', label: 'YAML', ext: 'yml' },
  { value: 'markdown', label: 'Markdown', ext: 'md' },
  { value: 'other', label: 'Other', ext: '' },
];

/** Simple auto-detect based on common patterns */
function detectLanguage(code: string): string {
  const trimmed = code.trim();
  if (/^(import\s+.*from\s+['"]|export\s+(default\s+)?|interface\s+|type\s+\w+\s*=)/.test(trimmed)) return 'typescript';
  if (/^(const\s+|let\s+|var\s+|function\s+|=>\s*\{|require\()/.test(trimmed)) return 'javascript';
  if (/^(def\s+|class\s+|import\s+\w+|from\s+\w+\s+import|print\()/.test(trimmed)) return 'python';
  if (/^(<html|<div|<head|<!DOCTYPE)/i.test(trimmed)) return 'html';
  if (/^(\.|#|@media|@import|:root)/.test(trimmed)) return 'css';
  if (/^(public\s+class\s+|package\s+|import\s+java\.)/.test(trimmed)) return 'java';
  if (/^(SELECT\s+|INSERT\s+|CREATE\s+|ALTER\s+|DROP\s+)/i.test(trimmed)) return 'sql';
  if (/^(func\s+|package\s+main)/.test(trimmed)) return 'go';
  if (/^(fn\s+|use\s+|pub\s+(fn|struct|enum))/.test(trimmed)) return 'rust';
  if (/^(<\?php|namespace\s+|use\s+\w+\\)/.test(trimmed)) return 'php';
  if (/^(\{|\[)/.test(trimmed) && /[}\]]$/.test(trimmed)) return 'json';
  if (/^(#!\s*\/bin\/(bash|sh)|echo\s+|export\s+\w+=)/.test(trimmed)) return 'bash';
  return '';
}

export interface CodeSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: {
    title: string;
    content: string;
    category?: string;
    collectionId?: string;
  }) => void;
  collections: Collection[];
}

export const CodeSnippetModal: React.FC<CodeSnippetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  collections,
}) => {
  const [title, setTitle] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [contextNote, setContextNote] = useState<string>('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [autoDetected, setAutoDetected] = useState<string>('');

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCode(value);

    // Auto-detect language if user hasn't manually selected one
    if (!language && value.trim().length > 10) {
      const detected = detectLanguage(value);
      if (detected) {
        setAutoDetected(detected);
      }
    }
  }, [language]);

  const handleLanguageSelect = (val: string) => {
    setLanguage(val);
    setAutoDetected('');
  };

  const effectiveLanguage = language || autoDetected;
  const langLabel = LANGUAGES.find(l => l.value === effectiveLanguage)?.label || '';

  const handleSave = () => {
    if (!code.trim()) return;

    const snippetTitle = title.trim() || `Code Snippet${langLabel ? ` — ${langLabel}` : ''}`;
    const langTag = effectiveLanguage || 'code';

    const htmlContent = `<pre><code class="language-${langTag}">${code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')}</code></pre>${contextNote.trim() ? `\n<h4>Context</h4>\n<p>${contextNote.replace(/\n/g, '<br/>')}</p>` : ''}`;

    const col = collections.find(c => c.id === selectedCollectionId);

    onSave({
      title: snippetTitle,
      content: htmlContent,
      category: col ? col.name : 'Code Snippets',
      collectionId: selectedCollectionId || undefined,
    });

    // Reset
    setTitle('');
    setCode('');
    setLanguage('');
    setContextNote('');
    setSelectedCollectionId('');
    setAutoDetected('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setCode('');
    setLanguage('');
    setContextNote('');
    setSelectedCollectionId('');
    setAutoDetected('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="💻 Save Code Snippet" maxWidth="max-w-xl">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#0F4C3A',
            colorText: '#0f3d3e',
            borderRadius: 12,
          },
        }}
      >
        <Form layout="vertical" className="space-y-3" onSubmitCapture={(e) => { e.preventDefault(); handleSave(); }}>

          {/* Title */}
          <Form.Item className="mb-2">
            <Input
              size="large"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Snippet name (e.g. useDebounce hook, Auth middleware)`}
              className="font-semibold text-base"
              autoFocus
            />
          </Form.Item>

          {/* Language Selector */}
          <Form.Item
            label={
              <span className="text-xs font-semibold text-[#0f3d3e] flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> Language
                {autoDetected && !language && (
                  <span className="text-[10px] font-medium text-[#0F4C3A] bg-[#A8E063]/25 px-1.5 py-0.5 rounded-full ml-1">
                    Auto-detected: {LANGUAGES.find(l => l.value === autoDetected)?.label}
                  </span>
                )}
              </span>
            }
            className="mb-2"
          >
            <Select
              value={language || undefined}
              onChange={handleLanguageSelect}
              placeholder={autoDetected ? `Auto: ${LANGUAGES.find(l => l.value === autoDetected)?.label}` : "Select language"}
              className="w-full"
              allowClear
              showSearch
              optionFilterProp="label"
              options={LANGUAGES.map(l => ({ value: l.value, label: l.label }))}
              suffixIcon={<ChevronDown className="w-4 h-4 text-[#4B5563]" />}
            />
          </Form.Item>

          {/* Code Editor Area */}
          <Form.Item
            label={<span className="text-xs font-semibold text-[#0f3d3e]">Code</span>}
            className="mb-2"
          >
            <div className="relative rounded-xl overflow-hidden border border-[#0f3d3e]/15 focus-within:border-[#0F4C3A]/40 transition-colors">
              <textarea
                value={code}
                onChange={handleCodeChange}
                placeholder="// Paste or write your code here..."
                rows={10}
                spellCheck={false}
                className="w-full px-4 py-3 bg-[#1a1a2e] text-[#e2e8f0] font-mono text-sm leading-relaxed resize-y focus:outline-none placeholder:text-[#4B5563] min-h-[180px]"
                style={{ tabSize: 2 }}
                onKeyDown={(e) => {
                  // Tab support in code area
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = e.currentTarget.selectionStart;
                    const end = e.currentTarget.selectionEnd;
                    const val = e.currentTarget.value;
                    setCode(val.substring(0, start) + '  ' + val.substring(end));
                    setTimeout(() => {
                      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
                    }, 0);
                  }
                }}
              />
              {effectiveLanguage && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">
                  {effectiveLanguage}
                </div>
              )}
            </div>
          </Form.Item>

          {/* Context Note */}
          <Form.Item
            label={<span className="text-xs font-semibold text-[#0f3d3e]">Context Note <span className="font-normal text-[#4B5563]">(optional)</span></span>}
            className="mb-2"
          >
            <TextArea
              rows={2}
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              placeholder="Why is this snippet useful? Where to use it?"
              className="text-sm"
            />
          </Form.Item>

          {/* Collection */}
          <Form.Item
            label={
              <span className="text-xs font-semibold text-[#0f3d3e] flex items-center gap-1">
                <Folder className="w-3.5 h-3.5" /> Save to Collection
              </span>
            }
            className="mb-2"
          >
            <Select
              value={selectedCollectionId || undefined}
              onChange={(val) => setSelectedCollectionId(val || '')}
              placeholder="Select a collection"
              className="w-full"
              allowClear
              options={collections.map(col => ({ value: col.id, label: col.name }))}
            />
          </Form.Item>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#0f3d3e]/10">
            <span className="text-[11px] text-[#4B5563]">
              {code.split('\n').length} lines
            </span>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={!code.trim()} type="button">
                Save Snippet
              </Button>
            </div>
          </div>
        </Form>
      </ConfigProvider>
    </Modal>
  );
};
