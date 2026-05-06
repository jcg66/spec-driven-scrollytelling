import { createElement, type ReactNode } from "react";

import {
  CapabilityList,
  CodeSample,
  DecisionFlow,
  EventLog,
  StatGrid,
  Timeline,
} from "@/components/visualizations";
import type { MarkdownBlockNode, MarkdownInlineNode } from "@/lib/content";

type MarkdownContentProps = {
  blocks: MarkdownBlockNode[];
};

type StatGridPayload = {
  items: Array<{
    value: string;
    label: string;
  }>;
};

type TimelinePayload = {
  entries: Array<{
    when: string;
    label: string;
    description: string;
  }>;
};

type EventLogPayload = {
  entries: Array<{
    level: "info" | "success" | "warning" | "error";
    message: string;
    detail?: string;
  }>;
};

type CapabilityListPayload = {
  items: Array<{
    name: string;
    description: string;
  }>;
};

type DecisionFlowPayload = {
  nodes: Array<{
    id: string;
    label: string;
  }>;
  edges: Array<{
    from: string;
    to: string;
    label?: string;
  }>;
};

type CodeSamplePayload = {
  title?: string;
  language: string;
  code: string;
  caption?: string;
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

function renderVisualizationBlock(block: Extract<MarkdownBlockNode, { type: "visualization" }>, key: number): ReactNode {
  switch (block.componentId) {
    case "stat-grid":
      return <StatGrid key={key} items={(block.payload as StatGridPayload).items} />;
    case "timeline":
      return <Timeline key={key} entries={(block.payload as TimelinePayload).entries} />;
    case "event-log":
      return <EventLog key={key} entries={(block.payload as EventLogPayload).entries} />;
    case "capability-list":
      return <CapabilityList key={key} items={(block.payload as CapabilityListPayload).items} />;
    case "decision-flow":
      return <DecisionFlow key={key} nodes={(block.payload as DecisionFlowPayload).nodes} edges={(block.payload as DecisionFlowPayload).edges} />;
    case "code-sample":
      return (
        <CodeSample
          key={key}
          title={(block.payload as CodeSamplePayload).title}
          language={(block.payload as CodeSamplePayload).language}
          code={(block.payload as CodeSamplePayload).code}
          caption={(block.payload as CodeSamplePayload).caption}
        />
      );
  }
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

        if (block.type === "visualization") {
          return renderVisualizationBlock(block, index);
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
