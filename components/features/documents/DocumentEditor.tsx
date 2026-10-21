'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorToolbar from './EditorToolbar';
import type { IDocument } from '@/server/models/Document';
import { useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

interface DocEditorProps {
  document: IDocument;
}

const DocEditor = ({ document }: DocEditorProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const broadcastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const editorRef = useRef<typeof editor | null>(null);

  useEffect(() => {
    const socket = io();
    socketRef.current = socket;
    console.log('connected to socket');
    socket.on('disconnect', (reason) => {
      console.log('Disconnected', reason);
    });
    socket.on('content-change', (data) => {
      editorRef.current?.commands.setContent(data);
    });
    socket.emit('join-document', document._id);
    return () => {
      socket.disconnect();
      console.log('disconnected from socket');
    };
  }, [document._id]);

  async function saveDocument() {
    try {
      const editorObj = editor.getJSON();
      await fetch(`/api/document/${document._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editorObj }),
      });
    } catch {
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
      if (broadcastTimeoutRef.current) {
        clearTimeout(broadcastTimeoutRef.current);
      }
      broadcastTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('content-change', editor.getJSON());
      }, 1500);
    },
  });
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

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
