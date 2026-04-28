import type { ReactNode } from "react";

function inlineText(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/`(.*?)`/g, "$1");
}

export function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="my-5 list-disc space-y-2 pl-6">
        {listItems.map((item) => (
          <li key={item}>{inlineText(item)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }
    if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
      continue;
    }

    flushList();
    if (trimmed.startsWith("# ")) {
      blocks.push(
        <h1 key={`h1-${blocks.length}`} className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {inlineText(trimmed.slice(2))}
        </h1>,
      );
    } else if (trimmed.startsWith("## ")) {
      blocks.push(
        <h2 key={`h2-${blocks.length}`} className="font-heading mt-9 text-2xl font-semibold tracking-tight">
          {inlineText(trimmed.slice(3))}
        </h2>,
      );
    } else if (trimmed.startsWith("### ")) {
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="font-heading mt-7 text-xl font-semibold tracking-tight">
          {inlineText(trimmed.slice(4))}
        </h3>,
      );
    } else {
      blocks.push(
        <p key={`p-${blocks.length}`} className="leading-8 text-foreground/85">
          {inlineText(trimmed)}
        </p>,
      );
    }
  }

  flushList();

  return <div className="space-y-4">{blocks}</div>;
}
