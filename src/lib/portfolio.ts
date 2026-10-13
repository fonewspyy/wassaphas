import "server-only";
import { connection } from "next/server";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import seed from "../../db/seed.json";
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

function seedProjects(): Project[] {
  return seed.projects.map((p, i) => ({
    id: i + 1,
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    description: p.description,
    role: p.role,
    tech: p.tech,
    highlights: p.highlights,
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
    description: r.description,
    role: r.role,
    tech: parseJsonArray(r.tech),
    highlights: parseJsonArray(r.highlights),
    repoUrl: r.repo_url,
    liveUrl: r.live_url,
    year: r.year,
    featured: Boolean(r.featured),
    published: Boolean(r.published),
    sortOrder: r.sort_order,
  };
}

const PROJECT_COLUMNS = `id, slug, title, summary, description, role, tech, highlights,
  repo_url, live_url, year, featured, published, sort_order`;

/** Public listing: published only, featured first. */
export async function getPublishedProjects(): Promise<Project[]> {
  await connection();
  if (readFromSeed()) {
    return seedProjects()
      .filter((p) => p.published)
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder);
  }
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT ${PROJECT_COLUMNS} FROM projects
     WHERE published = 1 ORDER BY featured DESC, sort_order, id`,
  );
  return rows.map(toProject);
}

export async function getPublishedProject(slug: string): Promise<Project | null> {
  await connection();
  if (readFromSeed()) return seedProjects().find((p) => p.slug === slug && p.published) ?? null;
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT ${PROJECT_COLUMNS} FROM projects WHERE slug = ? AND published = 1`,
    [slug],
  );
  return rows[0] ? toProject(rows[0]) : null;
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

export async function getExperiences(): Promise<Experience[]> {
  await connection();
  if (readFromSeed()) return seed.experiences.map((e, i) => ({ id: i + 1, ...e }));
  const [rows] = await db().query<RowDataPacket[]>(
    "SELECT id, company, title, period, summary FROM experiences ORDER BY sort_order, id",
  );
  return rows.map((r) => ({
    id: r.id,
    company: r.company,
    title: r.title,
    period: r.period,
    summary: r.summary,
  }));
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
    p.slug, p.title, p.summary, p.description, p.role,
    JSON.stringify(p.tech), JSON.stringify(p.highlights),
    p.repoUrl, p.liveUrl, p.year, p.featured ? 1 : 0, p.published ? 1 : 0, p.sortOrder,
  ];
}

export async function createProject(p: ProjectInput): Promise<number> {
  const [res] = await db().execute<ResultSetHeader>(
    `INSERT INTO projects (slug, title, summary, description, role, tech, highlights,
       repo_url, live_url, year, featured, published, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    projectParams(p),
  );
  return res.insertId;
}

export async function updateProject(id: number, p: ProjectInput): Promise<void> {
  await db().execute(
    `UPDATE projects SET slug = ?, title = ?, summary = ?, description = ?, role = ?,
       tech = ?, highlights = ?, repo_url = ?, live_url = ?, year = ?, featured = ?,
       published = ?, sort_order = ?
     WHERE id = ?`,
    [...projectParams(p), id],
  );
}

export async function deleteProject(id: number): Promise<void> {
  await db().execute("DELETE FROM projects WHERE id = ?", [id]);
}
