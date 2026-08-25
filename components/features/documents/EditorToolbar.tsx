'use client';
import type { Editor } from '@tiptap/core';
import { Button } from '@/components/ui/button';
interface EditorTool {
  editor: Editor | null;
}
const EditorToolbar = ({ editor }: EditorTool) => {
  if (!editor) return null;
  return (
    <>
      <Button
        onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        Bold
      </Button>
      <Button
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        Italic
      </Button>
      {/* <Button onClick={() => editor.chain().focus().toggleUnderline().run()}>
        Underline
      </Button> */}
      {/* <select name="heading" id="heading">
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
      </select> */}
      <Button
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
          console.log(JSON.stringify(editor.getJSON(), null, 2));
        }}
      >
        Heading
      </Button>
      <Button
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        Bullet list
      </Button>
      <Button
        onClick={() => {
          const success = editor.chain().focus().toggleOrderedList().run();
          console.log('orederd command succeeded:', success);
        }}
      >
        Numbered list
      </Button>
    </>
  );
};
export default EditorToolbar;
