import { describe, expect, it } from "vitest";

import { PageLayoutFactory, PresentationLayout, StandardLayout } from "@/components/layouts";

describe("PageLayoutFactory", () => {
  it("selects the standard layout for standard pages", () => {
    const element = PageLayoutFactory({
      layout: "standard",
      title: "Standard",
      summary: "Standard summary",
      children: "child",
    });

    expect(element.type).toBe(StandardLayout);
  });

  it("selects the presentation layout for presentation pages", () => {
    const element = PageLayoutFactory({
      layout: "presentation",
      title: "Presentation",
      summary: "Presentation summary",
      children: "child",
    });

    expect(element.type).toBe(PresentationLayout);
  });
});
