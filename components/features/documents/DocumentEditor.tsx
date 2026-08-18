'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorToolbar from './EditorToolbar';

const DocEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello</p>',
  });

  return (
    <>
      <EditorToolbar editor={editor}></EditorToolbar>
      <EditorContent editor={editor}></EditorContent>
    </>
  );
};

export default DocEditor;
