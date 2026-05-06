import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  CapabilityList,
  CodeSample,
  DecisionFlow,
  EventLog,
  StatGrid,
  Timeline,
} from "@/components/visualizations";

describe("visualization widgets", () => {
  it("renders stat grid content and reduced-motion fallback", () => {
    const richMarkup = renderToStaticMarkup(
      <StatGrid
        items={[
          { value: "85%", label: "Engagement" },
          { value: "3.2s", label: "Avg dwell" },
        ]}
      />,
    );

    const reducedMarkup = renderToStaticMarkup(
      <StatGrid
        reducedMotion
        items={[
          { value: "85%", label: "Engagement" },
          { value: "3.2s", label: "Avg dwell" },
        ]}
      />,
    );

    expect(richMarkup).toContain("visualizationStatGridList");
    expect(richMarkup).toContain("85%");
    expect(reducedMarkup).toContain('data-motion-mode="reduced"');
  });

  it("renders timeline and capability list widgets", () => {
    const markup = renderToStaticMarkup(
      <>
        <Timeline
          entries={[
            { when: "0%", label: "Spark", description: "The story opens with an intent." },
            { when: "40%", label: "Digital Eye", description: "The agent grounds itself in the interface." },
          ]}
        />
        <CapabilityList
          items={[
            { name: "Perception", description: "Read the visible situation." },
            { name: "Execution", description: "Carry out the plan in software." },
          ]}
        />
      </>
    );

    expect(markup).toContain("visualizationTimelineList");
    expect(markup).toContain("visualizationCapabilityListGrid");
    expect(markup).toContain("Perception");
  });

  it("renders event log, decision flow, and code sample widgets with fallback state", () => {
    const markup = renderToStaticMarkup(
      <>
        <EventLog
          entries={[
            { level: "info", message: "Scanning interface" },
            { level: "success", message: "Action completed", detail: "Updated the task board." },
          ]}
        />
        <DecisionFlow
          reducedMotion
          nodes={[
            { id: "goal", label: "Goal" },
            { id: "plan", label: "Plan" },
            { id: "action", label: "Action" },
          ]}
          edges={[
            { from: "goal", to: "plan", label: "decompose" },
            { from: "plan", to: "action", label: "execute" },
          ]}
        />
        <CodeSample title="Payload" language="json" code='{"ok":true}' caption="Static code sample." />
      </>
    );

    expect(markup).toContain("visualizationEventLogList");
    expect(markup).toContain("visualizationDecisionFlowEdges");
    expect(markup).toContain('data-motion-mode="reduced"');
    expect(markup).toContain("visualizationCodeSampleBlock");
  });
});