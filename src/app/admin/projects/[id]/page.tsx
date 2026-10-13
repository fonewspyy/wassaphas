import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ConfirmButton } from "@/components/confirm-button";
import { Skeleton } from "@/components/section";
import { requireAdmin } from "@/lib/auth";
import { getProjectById } from "@/lib/portfolio";
import { removeProject } from "../../actions";
import { ProjectForm } from "../project-form";

export default function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: PageProps<"/admin/projects/[id]">["params"] }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit: {project.title}</h1>
        <form action={removeProject.bind(null, project.id)}>
          <ConfirmButton message={`Delete "${project.title}"? This cannot be undone.`} className="text-sm text-danger">
            Delete project
          </ConfirmButton>
        </form>
      </div>
      <ProjectForm project={project} />
    </>
  );
}
