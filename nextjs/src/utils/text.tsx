// src/utils/text.tsx
import type { ReactNode } from 'react';

export function withLineBreaks(input: unknown): ReactNode[] {
  if (typeof input !== 'string') return [];
  const normalised = input.replace(/\\n/g, '\n');
  return normalised.split('\n').flatMap((part, idx) =>
    idx === 0 ? [part] : [<br key={idx} />, part]
  );
}

function addRuby(target: HTMLElement, text: string, rubyText: string) {
  const ruby = document.createElement('ruby');
  const rb = document.createElement('rb');
  rb.textContent = text;
  const rt = document.createElement('rt');
  rt.textContent = rubyText;

  ruby.appendChild(rb);
  ruby.appendChild(rt);
  target.appendChild(ruby);
}