'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { Form } from 'antd';
import { Folder, Briefcase, Code, FileText } from 'lucide-react';

export interface NewCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string, icon?: string) => void;
}

export const NewCollectionModal: React.FC<NewCollectionModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [newColName, setNewColName] = useState<string>('');
  const [newColDesc, setNewColDesc] = useState<string>('');
  const [newColIcon, setNewColIcon] = useState<string>('Folder');

  const getColIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-[#0F4C3A]" />;
      case 'Code': return <Code className="w-5 h-5 text-[#0F4C3A]" />;
      case 'FileText': return <FileText className="w-5 h-5 text-[#0F4C3A]" />;
      default: return <Folder className="w-5 h-5 text-[#0F4C3A]" />;
    }
  };

  const handleCreate = () => {
    if (!newColName.trim()) return;
    onCreate(newColName.trim(), newColDesc.trim() || undefined, newColIcon);
    setNewColName('');
    setNewColDesc('');
    setNewColIcon('Folder');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📁 Create New Collection" maxWidth="max-w-md">
      <Form layout="vertical" className="space-y-3" onSubmitCapture={(e) => { e.preventDefault(); handleCreate(); }}>
        <Form.Item label={<span className="text-xs font-semibold text-[#0f3d3e]">Collection Name</span>} className="mb-3">
          <Input
            size="large"
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            placeholder="e.g., Portfolio Hero Copy, React 19 Architecture"
            className="font-medium text-base"
            autoFocus
          />
        </Form.Item>

        <Form.Item label={<span className="text-xs font-semibold text-[#0f3d3e]">Description (Optional)</span>} className="mb-3">
          <TextArea
            rows={3}
            value={newColDesc}
            onChange={(e) => setNewColDesc(e.target.value)}
            placeholder="What kind of notes will live in this folder?"
            className="text-sm"
          />
        </Form.Item>

        <Form.Item label={<span className="text-xs font-semibold text-[#0f3d3e]">Folder Icon</span>} className="mb-2">
          <div className="flex items-center gap-3">
            {['Folder', 'Briefcase', 'Code', 'FileText'].map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setNewColIcon(icon)}
                className={`p-2.5 rounded-xl border transition-all ${
                  newColIcon === icon ? 'bg-[#0F4C3A] text-[#F7F3EA] border-[#0f3d3e]' : 'bg-white text-[#0f3d3e] border-[#0f3d3e]/15 hover:bg-[#0f3d3e]/5'
                }`}
              >
                {getColIcon(icon)}
              </button>
            ))}
          </div>
        </Form.Item>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0f3d3e]/10">
          <Button variant="secondary" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="accent" size="sm" onClick={handleCreate} disabled={!newColName.trim()} type="button">
            Create Folder
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
