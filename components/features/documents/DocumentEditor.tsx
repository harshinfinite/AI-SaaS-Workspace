'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorToolbar from './EditorToolbar';
import type { IDocument } from '@/server/models/Document';

interface DocEditorProps {
  document: IDocument;
}

const DocEditor = ({ document }: DocEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: document.content,
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
