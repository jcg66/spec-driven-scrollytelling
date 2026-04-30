import { AppShell } from "@/components/app/AppShell";
import { StandardLayout } from "@/components/layouts";
import { createRoutePath } from "@/lib/site-config";

export default function NotFoundPage() {
  return (
    <AppShell>
      <StandardLayout
        title="Page Not Found"
        summary="This route is not part of the current static export. Future content-driven pages will be generated explicitly."
        eyebrow="Static Miss"
      >
        <p>
          <a href={createRoutePath()}>Return Home</a>
        </p>
      </StandardLayout>
    </AppShell>
  );
}
