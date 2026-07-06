import React from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * Renders fenced code blocks from react-markdown as dark, rounded panels
 * with a language label and copy-to-clipboard button. Inline `code` spans
 * (no className from the fence) fall back to a plain pill style.
 */
export function CodeBlock({ className, children, ...props }) {
  const [copied, setCopied] = React.useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const isBlock = Boolean(match);
  const code = String(children).replace(/\n$/, '');

  if (!isBlock) {
    return (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.85em] text-slate-800" {...props}>
        {children}
      </code>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl bg-slate-900 shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {match[1]}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-white"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[0.875rem] leading-relaxed text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
