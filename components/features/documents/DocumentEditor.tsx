'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorToolbar from './EditorToolbar';
import type { IDocument } from '@/server/models/Document';
import { useRef } from 'react';

interface DocEditorProps {
  document: IDocument;
}

const DocEditor = ({ document }: DocEditorProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function saveDocument() {
    try {
      const editorObj = editor.getJSON();
      const response = await fetch(`/api/document/${document._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editorObj }),
      });
    } catch (_) {
      console.log('Something went wrong!');
    }
  }
  const editor = useEditor({
    extensions: [StarterKit],
    content: document.content,
    onUpdate: ({ editor }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        saveDocument();
      }, 3000);
    },
  });

  return (
    <>
      <EditorToolbar editor={editor}></EditorToolbar>
      <EditorContent
        editor={editor}
        className="[&_h1]:text-3xl [&_h1]:font-bold [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4"
      ></EditorContent>
    </>
  );
};

export default DocEditor;
