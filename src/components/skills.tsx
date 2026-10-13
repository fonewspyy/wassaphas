import type { Dictionary } from "@/i18n/dictionaries";
import { getSkills } from "@/lib/portfolio";
import { SKILL_CATEGORIES, type SkillCategory } from "@/lib/types";
import { Reveal } from "./motion/reveal";
import { Skeleton } from "./section";

const CODES: Record<SkillCategory, string> = {
  frontend: "FE",
  backend: "BE",
  database: "DB",
  ai: "AI",
  devops: "OPS",
};

export async function Skills({ dict }: { dict: Dictionary }) {
  const groups = await getSkills();
  return (
    <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
      {SKILL_CATEGORIES.filter((c) => groups[c].length > 0).map((category) => (
        <div key={category} className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{dict.skills[category]}</h3>
            <span className="font-mono text-xs text-accent">{CODES[category]}</span>
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
    </Reveal>
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
