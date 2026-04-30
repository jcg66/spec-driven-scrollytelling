import { AppShell } from "@/components/app/AppShell";
import { StandardLayout } from "@/components/layouts";

export default function NotFoundPage() {
  return (
    <AppShell>
      <StandardLayout
        title="Page Not Found"
        summary="This route is not part of the current static export. Future content-driven pages will be generated explicitly."
        eyebrow="Static Miss"
      />
    </AppShell>
  );
}
