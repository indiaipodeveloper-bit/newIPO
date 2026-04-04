import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichEditor: React.FC<RichEditorProps> = ({ value, onChange, placeholder, className }) => {
  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }, 'blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }, { 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'font', 'size',
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'link', 'image', 'video'
  ];

  return (
    <div className={cn("rich-editor-container", className)}>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-background rounded-lg border border-border"
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .rich-editor-container .ql-container {
          min-height: 350px;
          font-size: 16px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .rich-editor-container .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background: #f8fafc;
          border-color: hsl(var(--border));
        }
        .rich-editor-container .ql-container.ql-snow {
          border-color: hsl(var(--border));
        }
        .rich-editor-container .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
        }
        .rich-editor-container .ql-editor {
          min-height: 350px;
        }
      `}} />
    </div>
  );
};

export default RichEditor;
