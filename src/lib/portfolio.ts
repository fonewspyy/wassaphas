import "server-only";
import { connection } from "next/server";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import seed from "../../db/seed.json";
import type { Locale } from "@/i18n/config";
import { db, hasDatabase, parseJsonArray } from "./db";
import {
  SKILL_CATEGORIES,
  type Experience,
  type Project,
  type SkillCategory,
  type SkillGroups,
} from "./types";

// Without DATABASE_URL (local dev, preview) the site renders db/seed.json read-only.
// Production must have a database: silently serving seed data there would hide an outage.
function readFromSeed(): boolean {
  if (hasDatabase()) return false;
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required in production");
  }
  return true;
}

// ---- Localisation: Thai columns fall back to English when empty -----------------

/** A project as a visitor sees it: English fields replaced by Thai where Thai exists. */
export function localizeProject(p: Project, locale: Locale): Project {
  if (locale !== "th") return p;
  return {
    ...p,
    summary: p.summaryTh || p.summary,
    description: p.descriptionTh || p.description,
    role: p.roleTh || p.role,
    highlights: p.highlightsTh?.length ? p.highlightsTh : p.highlights,
  };
}

function localizeExperience(e: Experience, locale: Locale): Experience {
  if (locale !== "th") return e;
  return {
    ...e,
    title: e.titleTh || e.title,
    period: e.periodTh || e.period,
    summary: e.summaryTh || e.summary,
    highlights: e.highlightsTh?.length ? e.highlightsTh : e.highlights,
  };
}

// ---- Row mapping ------------------------------------------------------------------

function seedProjects(): Project[] {
  return seed.projects.map((p, i) => ({
    id: i + 1,
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    summaryTh: p.summary_th,
    description: p.description,
    descriptionTh: p.description_th,
    role: p.role,
    roleTh: p.role_th,
    tech: p.tech,
    highlights: p.highlights,
    highlightsTh: p.highlights_th,
    repoUrl: p.repo_url,
    liveUrl: p.live_url,
    year: p.year,
    featured: p.featured,
    published: p.published,
    sortOrder: (i + 1) * 10,
  }));
}

function toProject(r: RowDataPacket): Project {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    summaryTh: r.summary_th,
    description: r.description,
    descriptionTh: r.description_th,
    role: r.role,
    roleTh: r.role_th,
    tech: parseJsonArray(r.tech),
    highlights: parseJsonArray(r.highlights),
    highlightsTh: r.highlights_th == null ? null : parseJsonArray(r.highlights_th),
    repoUrl: r.repo_url,
    liveUrl: r.live_url,
    year: r.year,
    featured: Boolean(r.featured),
    published: Boolean(r.published),
    sortOrder: r.sort_order,
  };
}

const PROJECT_COLUMNS = `id, slug, title, summary, summary_th, description, description_th,
  role, role_th, tech, highlights, highlights_th, repo_url, live_url, year, featured,
  published, sort_order`;

// ---- Public reads -------------------------------------------------------------------

/** Published only, featured first. */
export async function getPublishedProjects(locale: Locale): Promise<Project[]> {
  await connection();
  let projects: Project[];
  if (readFromSeed()) {
    projects = seedProjects()
      .filter((p) => p.published)
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder);
  } else {
    const [rows] = await db().query<RowDataPacket[]>(
      `SELECT ${PROJECT_COLUMNS} FROM projects
       WHERE published = 1 ORDER BY featured DESC, sort_order, id`,
    );
    projects = rows.map(toProject);
  }
  return projects.map((p) => localizeProject(p, locale));
}

export async function getPublishedProject(slug: string, locale: Locale): Promise<Project | null> {
  await connection();
  let project: Project | null;
  if (readFromSeed()) {
    project = seedProjects().find((p) => p.slug === slug && p.published) ?? null;
  } else {
    const [rows] = await db().query<RowDataPacket[]>(
      `SELECT ${PROJECT_COLUMNS} FROM projects WHERE slug = ? AND published = 1`,
      [slug],
    );
    project = rows[0] ? toProject(rows[0]) : null;
  }
  return project && localizeProject(project, locale);
}

export async function getSkills(): Promise<SkillGroups> {
  await connection();
  const groups = Object.fromEntries(SKILL_CATEGORIES.map((c) => [c, [] as string[]])) as SkillGroups;
  if (readFromSeed()) {
    for (const c of SKILL_CATEGORIES) groups[c] = [...seed.skills[c]];
    return groups;
  }
  const [rows] = await db().query<RowDataPacket[]>(
    "SELECT category, name FROM skills ORDER BY sort_order, id",
  );
  for (const r of rows) groups[r.category as SkillCategory]?.push(r.name);
  return groups;
}

export async function getExperiences(locale: Locale): Promise<Experience[]> {
  await connection();
  let items: Experience[];
  if (readFromSeed()) {
    items = seed.experiences.map((e, i) => ({
      id: i + 1,
      company: e.company,
      title: e.title,
      titleTh: e.title_th,
      period: e.period,
      periodTh: e.period_th,
      summary: e.summary,
      summaryTh: e.summary_th,
      highlights: e.highlights,
      highlightsTh: e.highlights_th,
    }));
  } else {
    const [rows] = await db().query<RowDataPacket[]>(
      `SELECT id, company, title, title_th, period, period_th, summary, summary_th,
         highlights, highlights_th
       FROM experiences ORDER BY sort_order, id`,
    );
    items = rows.map((r) => ({
      id: r.id,
      company: r.company,
      title: r.title,
      titleTh: r.title_th,
      period: r.period,
      periodTh: r.period_th,
      summary: r.summary,
      summaryTh: r.summary_th,
      highlights: r.highlights == null ? [] : parseJsonArray(r.highlights),
      highlightsTh: r.highlights_th == null ? null : parseJsonArray(r.highlights_th),
    }));
  }
  return items.map((e) => localizeExperience(e, locale));
}

// ---- Admin (callers must verify the session first) -------------------------------

export async function getAllProjects(): Promise<Project[]> {
  await connection();
  if (readFromSeed()) return seedProjects();
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT ${PROJECT_COLUMNS} FROM projects ORDER BY sort_order, id`,
  );
  return rows.map(toProject);
}

export async function getProjectById(id: number): Promise<Project | null> {
  await connection();
  if (readFromSeed()) return seedProjects().find((p) => p.id === id) ?? null;
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT ${PROJECT_COLUMNS} FROM projects WHERE id = ?`,
    [id],
  );
  return rows[0] ? toProject(rows[0]) : null;
}

export type ProjectInput = Omit<Project, "id">;

function projectParams(p: ProjectInput) {
  return [
    p.slug, p.title, p.summary, p.summaryTh, p.description, p.descriptionTh, p.role, p.roleTh,
    JSON.stringify(p.tech), JSON.stringify(p.highlights),
    p.highlightsTh?.length ? JSON.stringify(p.highlightsTh) : null,
    p.repoUrl, p.liveUrl, p.year, p.featured ? 1 : 0, p.published ? 1 : 0, p.sortOrder,
  ];
}

export async function createProject(p: ProjectInput): Promise<number> {
  const [res] = await db().execute<ResultSetHeader>(
    `INSERT INTO projects (slug, title, summary, summary_th, description, description_th,
       role, role_th, tech, highlights, highlights_th, repo_url, live_url, year, featured,
       published, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    projectParams(p),
  );
  return res.insertId;
}

export async function updateProject(id: number, p: ProjectInput): Promise<void> {
  await db().execute(
    `UPDATE projects SET slug = ?, title = ?, summary = ?, summary_th = ?, description = ?,
       description_th = ?, role = ?, role_th = ?, tech = ?, highlights = ?, highlights_th = ?,
       repo_url = ?, live_url = ?, year = ?, featured = ?, published = ?, sort_order = ?
     WHERE id = ?`,
    [...projectParams(p), id],
  );
}

export async function deleteProject(id: number): Promise<void> {
  await db().execute("DELETE FROM projects WHERE id = ?", [id]);
}
