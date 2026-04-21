import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownViewer({ fileUrl }: { fileUrl: string }) {
  const [content, setContent] = useState('טוען תוכן...');

  useEffect(() => {
    fetch(fileUrl)
      .then(res => res.text())
      .then(text => setContent(text))
      .catch(() => setContent('שגיאה בטעינת הקובץ.'));
  }, [fileUrl]);

  return (
    <div className="markdown-body prose prose-slate max-w-none text-right rtl">
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
}
