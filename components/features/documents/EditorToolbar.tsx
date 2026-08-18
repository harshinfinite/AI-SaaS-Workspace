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
      <Button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </Button>
    </>
  );
};
export default EditorToolbar;
