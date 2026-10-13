"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { checkPassword, endSession, requireAdmin, startSession } from "@/lib/auth";
import { deleteMessage, setMessageRead } from "@/lib/messages";
import {
  createProject,
  deleteProject,
  updateProject,
  type ProjectInput,
} from "@/lib/portfolio";

// Every action re-checks the session: Server Actions are plain POST endpoints.

export type FormState = { error?: string } | undefined;

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    // Flat delay makes online guessing slow without needing a lockout table.
    await new Promise((r) => setTimeout(r, 1000));
    return { error: "Wrong password" };
  }
  await startSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

const lines = (v: string) =>
  v.split("\n").map((s) => s.trim()).filter(Boolean);

const optionalUrl = z
  .string()
  .trim()
  .transform((v) => v || null)
  .pipe(z.url({ protocol: /^https?$/ }).nullable());

const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: lowercase letters, numbers and dashes"),
  title: z.string().trim().min(1, "Title is required").max(120),
  summary: z.string().trim().min(1, "Summary is required").max(300),
  summaryTh: z.string().trim().max(400).transform((v) => v || null),
  description: z.string().trim().max(10000).transform((v) => v || null),
  descriptionTh: z.string().trim().max(10000).transform((v) => v || null),
  role: z.string().trim().max(120).transform((v) => v || null),
  roleTh: z.string().trim().max(160).transform((v) => v || null),
  tech: z.string().transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean)),
  highlights: z.string().transform(lines),
  highlightsTh: z.string().transform((v) => {
    const items = lines(v);
    return items.length ? items : null;
  }),
  repoUrl: optionalUrl,
  liveUrl: optionalUrl,
  year: z
    .string()
    .trim()
    .transform((v) => (v ? Number(v) : null))
    .pipe(z.number().int().min(2000).max(2100).nullable()),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.coerce.number().int(),
});

function parseProject(formData: FormData) {
  const raw = Object.fromEntries(formData);
  return projectSchema.safeParse({
    ...raw,
    featured: raw.featured === "on",
    published: raw.published === "on",
  });
}

function isDuplicateSlug(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "ER_DUP_ENTRY";
}

export async function saveProject(
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = parseProject(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const input: ProjectInput = parsed.data;
  try {
    if (id === null) await createProject(input);
    else await updateProject(id, input);
  } catch (err) {
    if (isDuplicateSlug(err)) return { error: "Another project already uses that slug" };
    throw err;
  }
  redirect("/admin");
}

export async function removeProject(id: number): Promise<void> {
  await requireAdmin();
  await deleteProject(id);
  redirect("/admin");
}

export async function toggleMessageRead(id: number, isRead: boolean): Promise<void> {
  await requireAdmin();
  await setMessageRead(id, isRead);
  redirect("/admin#messages");
}

export async function removeMessage(id: number): Promise<void> {
  await requireAdmin();
  await deleteMessage(id);
  redirect("/admin#messages");
}
