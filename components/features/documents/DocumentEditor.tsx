'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const DocEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello</p>',
  });

  return <EditorContent editor={editor}></EditorContent>;
};

export default DocEditor;
