"use client";

import { useEffect, useState } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

export function DocRenderer({ content }: { content: string }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    async function render() {
      try {
        const result = await unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeHighlight)
          .use(rehypeSlug)
          .use(rehypeStringify, { allowDangerousHtml: true })
          .process(content);
        setHtml(String(result));
      } catch {
        setHtml(`<p>${content}</p>`);
      }
    }
    render();
  }, [content]);

  if (!html) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-3/4 rounded bg-[var(--bg-secondary)]" />
        <div className="h-4 w-full rounded bg-[var(--bg-secondary)]" />
        <div className="h-4 w-5/6 rounded bg-[var(--bg-secondary)]" />
      </div>
    );
  }

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
