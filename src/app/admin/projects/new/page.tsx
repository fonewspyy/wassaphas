import { Suspense } from "react";
import { Skeleton } from "@/components/section";
import { requireAdmin } from "@/lib/auth";
import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">New project</h1>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <Guarded />
      </Suspense>
    </>
  );
}

async function Guarded() {
  await requireAdmin();
  return <ProjectForm />;
}
