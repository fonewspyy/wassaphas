import { caseStudies, type CaseStudy } from "@/content/case-studies";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { CaseStudyList } from "./case-study-list";

// "Analysis · Engineering": the kind of work a study shows, so readers can pick theirs.
export function caseTags(study: CaseStudy, dict: Dictionary) {
  return study.tags.map((t) => dict.caseStudies.tags[t]).join(" · ");
}

// Case studies as rows: where and when on the left, the story's headline on the right.
// The list itself is a client component so readers can filter it by kind of work.
export function CaseStudies({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const rows = caseStudies.map((study) => ({
    slug: study.slug,
    href: localePath(lang, `/case-studies/${study.slug}`),
    org: study.org,
    period: study.period[lang],
    tags: study.tags,
    title: study.title[lang],
    summary: study.summary[lang],
    stat: { value: study.stats[0].value, label: study.stats[0].label[lang] },
  }));
  return (
    <CaseStudyList
      rows={rows}
      tagLabels={dict.caseStudies.tags}
      allLabel={dict.caseStudies.all}
      filterLabel={dict.caseStudies.filterLabel}
      readLabel={dict.caseStudies.read}
    />
  );
}
