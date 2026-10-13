import type { Dictionary } from "@/i18n/dictionaries";
import { getSkills } from "@/lib/portfolio";
import { SKILL_CATEGORIES } from "@/lib/types";
import { Skeleton } from "./section";

// An inventory list, not a grid of chip cards: category on the left, items as plain text.
export async function Skills({ dict }: { dict: Dictionary }) {
  const groups = await getSkills();
  return (
    <dl>
      {SKILL_CATEGORIES.filter((c) => groups[c].length > 0).map((category) => (
        <div key={category} className="grid gap-x-10 gap-y-1 border-b border-hair py-5 first:pt-0 sm:grid-cols-[10rem_minmax(0,1fr)]">
          <dt className="font-semibold">{dict.skills[category]}</dt>
          <dd className="text-lg leading-relaxed text-ink-2">{groups[category].join(" · ")}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SkillsSkeleton() {
  return <Skeleton className="h-64" />;
}
