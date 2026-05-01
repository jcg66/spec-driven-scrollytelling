import { createElement, type ReactNode } from "react";

import type { MarkdownBlockNode, MarkdownInlineNode } from "@/lib/content";

type MarkdownContentProps = {
  blocks: MarkdownBlockNode[];
};

function renderInlineNode(node: MarkdownInlineNode, key: string): ReactNode {
  if (node.type === "text") {
    return node.value;
  }

  if (node.type === "emphasis") {
    return <em key={key}>{node.children.map((child, index) => renderInlineNode(child, `${key}-${index}`))}</em>;
  }

  return (
    <a key={key} href={node.href}>
      {node.children.map((child, index) => renderInlineNode(child, `${key}-${index}`))}
    </a>
  );
}

function renderInlineNodes(nodes: MarkdownInlineNode[]): ReactNode[] {
  return nodes.map((node, index) => renderInlineNode(node, `${index}`));
}

export function MarkdownContent({ blocks }: MarkdownContentProps) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const headingLevel = Math.min(block.level + 1, 6) as 2 | 3 | 4 | 5 | 6;
          const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";

          return createElement(HeadingTag, { key: index }, renderInlineNodes(block.inlines));
        }

        if (block.type === "paragraph") {
          return <p key={index}>{renderInlineNodes(block.inlines)}</p>;
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="list">
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{renderInlineNodes(item)}</li>
              ))}
            </ul>
          );
        }

        return (
          <pre key={index} className="codeLine">
            <code>{block.value}</code>
          </pre>
        );
      })}
    </>
  );
}
