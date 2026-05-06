import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MarkdownContent } from "@/components/content/MarkdownContent";

describe("MarkdownContent", () => {
  it("renders embedded visualization blocks through the shared widget library", () => {
    const markup = renderToStaticMarkup(
      <MarkdownContent
        blocks={[
          {
            type: "visualization",
            componentId: "event-log",
            value: '{"entries":[{"level":"info","message":"Action"},{"level":"success","message":"Done"}]}',
            payload: {
              entries: [
                {
                  level: "info",
                  message: "Action",
                },
                {
                  level: "success",
                  message: "Done",
                },
              ],
            },
          },
        ]}
      />,
    );

    expect(markup).toContain("visualizationEventLogList");
    expect(markup).toContain("Action");
    expect(markup).toContain("Done");
  });
});