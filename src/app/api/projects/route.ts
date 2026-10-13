import { getPublishedProjects } from "@/lib/portfolio";

export async function GET() {
  const projects = await getPublishedProjects();
  return Response.json({
    projects: projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      description: p.description,
      role: p.role,
      tech: p.tech,
      highlights: p.highlights,
      repoUrl: p.repoUrl,
      liveUrl: p.liveUrl,
      year: p.year,
      featured: p.featured,
    })),
  });
}
