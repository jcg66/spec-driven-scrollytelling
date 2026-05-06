type VisualizationMode = "rich" | "reduced";

type VisualizationBaseProps = {
  reducedMotion?: boolean;
};

type StatGridItem = {
  value: string;
  label: string;
};

type TimelineEntry = {
  when: string;
  label: string;
  description: string;
};

type EventLogEntry = {
  level: "info" | "success" | "warning" | "error";
  message: string;
  detail?: string;
};

type CapabilityListItem = {
  name: string;
  description: string;
};

type DecisionFlowNode = {
  id: string;
  label: string;
};

type DecisionFlowEdge = {
  from: string;
  to: string;
  label?: string;
};

type CodeSampleProps = VisualizationBaseProps & {
  title?: string;
  language: string;
  code: string;
  caption?: string;
};

type StatGridProps = VisualizationBaseProps & {
  items: StatGridItem[];
};

type TimelineProps = VisualizationBaseProps & {
  entries: TimelineEntry[];
};

type EventLogProps = VisualizationBaseProps & {
  entries: EventLogEntry[];
};

type CapabilityListProps = VisualizationBaseProps & {
  items: CapabilityListItem[];
};

type DecisionFlowProps = VisualizationBaseProps & {
  nodes: DecisionFlowNode[];
  edges: DecisionFlowEdge[];
};

function getVisualizationMode(reducedMotion?: boolean): VisualizationMode {
  return reducedMotion ? "reduced" : "rich";
}

function getVisualizationClassName(variantClassName: string, reducedMotion?: boolean): string {
  const classes = ["visualizationWidget", variantClassName];

  if (reducedMotion) {
    classes.push("visualizationWidget--reduced");
  }

  return classes.join(" ");
}

function renderVisualizationHeader(title?: string, description?: string) {
  if (!title && !description) {
    return null;
  }

  return (
    <header className="visualizationWidgetHeader">
      {title ? <h3 className="visualizationWidgetTitle">{title}</h3> : null}
      {description ? <p className="visualizationWidgetDescription">{description}</p> : null}
    </header>
  );
}

export function StatGrid({ items, reducedMotion }: StatGridProps) {
  return (
    <section className={getVisualizationClassName("visualizationStatGrid", reducedMotion)} data-motion-mode={getVisualizationMode(reducedMotion)} aria-label="Key statistics">
      {renderVisualizationHeader()}
      <ul className="visualizationStatGridList">
        {items.map((item) => (
          <li key={`${item.value}-${item.label}`} className="visualizationStatGridItem">
            <span className="visualizationStatGridValue">{item.value}</span>
            <span className="visualizationStatGridLabel">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Timeline({ entries, reducedMotion }: TimelineProps) {
  return (
    <section className={getVisualizationClassName("visualizationTimeline", reducedMotion)} data-motion-mode={getVisualizationMode(reducedMotion)} aria-label="Timeline">
      {renderVisualizationHeader()}
      <ol className="visualizationTimelineList">
        {entries.map((entry) => (
          <li key={`${entry.when}-${entry.label}`} className="visualizationTimelineItem">
            <p className="visualizationTimelineWhen">{entry.when}</p>
            <h4 className="visualizationTimelineLabel">{entry.label}</h4>
            <p className="visualizationTimelineDescription">{entry.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function getEventLevelLabel(level: EventLogEntry["level"]): string {
  return level.toUpperCase();
}

export function EventLog({ entries, reducedMotion }: EventLogProps) {
  return (
    <section className={getVisualizationClassName("visualizationEventLog", reducedMotion)} data-motion-mode={getVisualizationMode(reducedMotion)} aria-label="Event log">
      {renderVisualizationHeader()}
      <ul className="visualizationEventLogList">
        {entries.map((entry, index) => (
          <li key={`${entry.level}-${index}-${entry.message}`} className="visualizationEventLogItem" data-level={entry.level}>
            <p className="visualizationEventLogLevel">{getEventLevelLabel(entry.level)}</p>
            <p className="visualizationEventLogMessage">{entry.message}</p>
            {entry.detail ? <p className="visualizationEventLogDetail">{entry.detail}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CapabilityList({ items, reducedMotion }: CapabilityListProps) {
  return (
    <section className={getVisualizationClassName("visualizationCapabilityList", reducedMotion)} data-motion-mode={getVisualizationMode(reducedMotion)} aria-label="Capabilities">
      {renderVisualizationHeader()}
      <ul className="visualizationCapabilityListGrid">
        {items.map((item) => (
          <li key={item.name} className="visualizationCapabilityListItem">
            <p className="visualizationCapabilityListName">{item.name}</p>
            <p className="visualizationCapabilityListDescription">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DecisionFlow({ nodes, edges, reducedMotion }: DecisionFlowProps) {
  const nodeLookup = new Map(nodes.map((node) => [node.id, node] as const));

  return (
    <section className={getVisualizationClassName("visualizationDecisionFlow", reducedMotion)} data-motion-mode={getVisualizationMode(reducedMotion)} aria-label="Decision flow">
      {renderVisualizationHeader()}
      <div className="visualizationDecisionFlowNodes">
        {nodes.map((node, index) => (
          <article key={node.id} className="visualizationDecisionFlowNode">
            <p className="visualizationDecisionFlowNodeIndex">Node {index + 1}</p>
            <h4 className="visualizationDecisionFlowNodeLabel">{node.label}</h4>
            <p className="visualizationDecisionFlowNodeId">{node.id}</p>
          </article>
        ))}
      </div>
      <ol className="visualizationDecisionFlowEdges">
        {edges.map((edge, index) => {
          const fromNode = nodeLookup.get(edge.from)?.label ?? edge.from;
          const toNode = nodeLookup.get(edge.to)?.label ?? edge.to;

          return (
            <li key={`${edge.from}-${edge.to}-${index}`} className="visualizationDecisionFlowEdge">
              <span className="visualizationDecisionFlowEdgeLabel">{fromNode}</span>
              <span className="visualizationDecisionFlowArrow" aria-hidden="true">
                →
              </span>
              <span className="visualizationDecisionFlowEdgeLabel">{toNode}</span>
              {edge.label ? <span className="visualizationDecisionFlowEdgeNote">{edge.label}</span> : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function CodeSample({ title, language, code, caption, reducedMotion }: CodeSampleProps) {
  const headerDescription = title ? caption : undefined;

  return (
    <figure className={getVisualizationClassName("visualizationCodeSample", reducedMotion)} data-motion-mode={getVisualizationMode(reducedMotion)}>
      {renderVisualizationHeader(title, headerDescription)}
      <div className="visualizationCodeSampleMeta">
        <span className="visualizationCodeSampleLanguage">{language}</span>
      </div>
      <pre className="visualizationCodeSampleBlock">
        <code>{code}</code>
      </pre>
      {caption && !title ? <figcaption className="visualizationCodeSampleCaption">{caption}</figcaption> : null}
    </figure>
  );
}
