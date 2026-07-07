import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorToolbar } from './EditorToolbar';

/**
 * Styling applied to the editable surface. Mirrors the published article
 * look (ArticleBody) so authors see close to what readers get. These are
 * Tailwind arbitrary-variant selectors targeting the rendered HTML.
 */
const EDITOR_CONTENT_CLASS = [
  'ProseMirror min-h-[340px] px-5 py-4 text-[16px] leading-[1.7] text-slate-700 focus:outline-none',
  '[&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-slate-900',
  '[&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900',
  '[&_p]:mb-4',
  '[&_strong]:font-semibold [&_strong]:text-slate-900',
  '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6',
  '[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6',
  '[&_a]:font-medium [&_a]:text-amber-600 [&_a]:underline [&_a]:underline-offset-2',
  '[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600',
  '[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-[0.85rem] [&_pre]:text-slate-100',
  '[&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-slate-100 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-[0.85em]',
].join(' ');

/**
 * Standalone, controlled WYSIWYG editor.
 *
 * @param {string}   value        - current HTML string
 * @param {Function} onChange     - called with the latest HTML on every edit
 * @param {string}   placeholder  - empty-state hint
 */
export function RichTextEditor({ value = '', onChange, placeholder = 'Write your story…' }) {
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
    editorProps: {
      attributes: { class: EDITOR_CONTENT_CLASS },
    },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/30">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
