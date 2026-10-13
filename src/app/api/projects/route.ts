import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { getPublishedProjects } from "@/lib/portfolio";

// GET /api/projects?lang=th|en  (defaults to Thai)
export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("lang") ?? DEFAULT_LOCALE;
  if (!isLocale(requested)) {
    return Response.json({ error: "lang must be th or en" }, { status: 400 });
  }
  const projects = await getPublishedProjects(requested);
  return Response.json({
    lang: requested,
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
