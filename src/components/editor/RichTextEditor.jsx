import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorToolbar } from './EditorToolbar';

/**
 * Standalone, controlled WYSIWYG editor.
 *
 * The editable surface is styled as real CSS on `.ProseMirror` (see
 * index.css) — a clean white, sans-serif, Medium-like writing area, with
 * dark/monospaced styling reserved for actual code blocks.
 *
 * @param {string}   value        - current HTML string
 * @param {Function} onChange     - called with the latest HTML on every edit
 * @param {string}   placeholder  - empty-state hint
 */
export function RichTextEditor({ value = '', onChange, placeholder = 'Write your story…' }) {
  const [sourceMode, setSourceMode] = React.useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  // Sync external value into the editor (e.g. when an existing post loads
  // asynchronously). Guarded so typing doesn't fight the update cycle.
  React.useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  const sourcePreview = React.useMemo(
    () =>
      (value || '')
        .replace(/></g, '>\n<')
        .replace(/^\s+$/gm, '')
        .trim(),
    [value]
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/30">
      <EditorToolbar
        editor={editor}
        sourceMode={sourceMode}
        onToggleSourceMode={() => setSourceMode((prev) => !prev)}
      />
      {/* Scrollable viewport: content grows to a comfortable cap, then
          scrolls internally so long articles never break the layout. */}
      <div className="max-h-[58vh] min-h-[340px] overflow-y-auto">
        {sourceMode ? (
          <pre className="h-full min-h-[340px] whitespace-pre-wrap bg-slate-900 p-4 font-mono text-sm leading-6 text-slate-100">
            <code>{sourcePreview || '<!-- Start writing to generate HTML source -->'}</code>
          </pre>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  );
}
