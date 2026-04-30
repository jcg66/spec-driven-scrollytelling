This interaction plan bridges our **"System 3: The Action Layer"** theme with the technical realities of 2026 web design. We will use a **Single-Page Scroll-Activated (SPSA)** architecture.

---

## 🏗️ The Wireframe & Interaction Map

### Scene 1: The Spark (0% – 15%)
* **Location:** Hero Section (Full-screen viewport).
* **UI Elements:**
    * **Centered:** A 3D "Brain Core" (Canvas/WebGL) that pulses with a subtle "Neural Cobalt" glow.
    * **Overlay:** A minimalist terminal-style input field.
* **Interaction:** * As the user scrolls, the text in the prompt field types itself out. 
    * The "Brain Core" begins to spin faster as the scroll depth reaches 15%.
    * **Library:** *GSAP ScrollTrigger* to sync the typing speed with the scroll position.

### Scene 2: Deconstruction (15% – 45%)
* **Location:** The "Mind Map" Bento Grid.
* **UI Elements:**
    * The background shifts from "Midnight Ink" to a slightly lighter slate. 
    * A **Bento Grid** emerges, where each tile represents a sub-task: `[Calendar Auth]`, `[Flight API]`, `[Conflict Resolver]`.
* **Interaction:** * **Sticky Positioning:** The "Brain Core" shrinks and moves to the top-left corner, staying "stuck" there while the grid tiles fly in from the edges of the screen.
    * **Parallax:** As tiles move, they have different "depths," creating a 3D feeling of a machine thinking.
    * **Library:** *Motion.dev* for high-performance layout transitions.

### Scene 3: The Digital Eye (45% – 75%)
* **Location:** The "Computer Use" Sandbox.
* **UI Elements:**
    * A mock macOS/Windows browser window takes up 80% of the screen.
    * **Visual Grounding Overlay:** Glowing green "Bounding Boxes" appear over buttons like *Search*, *Book Now*, and *Add to Calendar*.
* **Interaction:** * **Cinematic Zoom:** The scroll doesn't move the page down; it zooms the camera *into* the browser window until we see the "pixels" and the technical labels (e.g., `role: button, id: 704`).
    * **Hover-Scroll:** As you scroll, a ghost cursor moves automatically to follow the AI’s "path of interest."
    * **Library:** *Theatre.js* to "direct" the camera movement and the cursor's path.

### Scene 4: The Execution Loop (75% – 90%)
* **Location:** The Action Log Sidebar.
* **UI Elements:**
    * The browser window stays in the center, but a **Terminal Sidebar** slides out from the right.
    * Green text streams in: `> Action: POST /api/calendar`, `> Response: 200 OK`.
* **Interaction:** * **High-Speed Scrubbing:** The faster the user scrolls, the faster the actions occur in the window. 
    * **Micro-Interactions:** Every time an action completes, the "Brain Core" in the corner flashes "Phosphor Green."

### Scene 5: The Outcome (90% – 100%)
* **Location:** Final Success Screen.
* **UI Elements:**
    * The browser and sidebar dissolve into a "Success Badge"—a clean, circular progress ring at 100%.
    * A "Summary Card" appears with the final results.
* **Interaction:** * **Conclusion:** The scroll locks. A "Start Over" button or a CTA to "Explore the Tech" (linking to our references) appears.

---

## 🛠️ Technical Stack Recommendations (2026)

| Layer | Tool | Why? |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16** | Native support for React Server Components (RSC) and fast hydration. |
| **Animation** | **Motion.dev** | Formerly Framer Motion; the industry standard for 2026 performant web motion. |
| **Scrolling** | **Lenis** | Ensures "buttery smooth" momentum scrolling that won't break CSS `sticky`. |
| **3D Elements** | **Three.js (WebGPU)** | For the "Brain Core" to ensure it looks cinematic without killing battery life. |
