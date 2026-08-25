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
      <EditorContent
        editor={editor}
        className="[&_h1]:text-3xl [&_h1]:font-bold [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4"
      ></EditorContent>
    </>
  );
};

export default DocEditor;
