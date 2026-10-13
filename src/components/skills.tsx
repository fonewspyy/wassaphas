import { getSkills } from "@/lib/portfolio";
import { SKILL_CATEGORIES, type SkillCategory } from "@/lib/types";
import { Skeleton } from "./section";

const LABELS: Record<SkillCategory, { title: string; code: string }> = {
  frontend: { title: "Frontend", code: "FE" },
  backend: { title: "Backend", code: "BE" },
  database: { title: "Database", code: "DB" },
  ai: { title: "AI & Agents", code: "AI" },
  devops: { title: "DevOps", code: "OPS" },
};

export async function Skills() {
  const groups = await getSkills();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SKILL_CATEGORIES.filter((c) => groups[c].length > 0).map((category) => (
        <div key={category} className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{LABELS[category].title}</h3>
            <span className="font-mono text-xs text-accent">{LABELS[category].code}</span>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {groups[category].map((skill) => (
              <li key={skill} className="rounded-lg bg-surface-2 px-2.5 py-1 text-sm">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function SkillsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-36" />
      ))}
    </div>
  );
}
