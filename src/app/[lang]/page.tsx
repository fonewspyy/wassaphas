import { notFound } from "next/navigation";
import { Suspense } from "react";
import { profile } from "@/content/profile";
import { papers } from "@/content/research";
import { CaseStudies } from "@/components/case-studies";
import { Experience, ExperienceSkeleton } from "@/components/experience";
import { FeaturedProject } from "@/components/featured-project";
import { AiPractice } from "@/components/ai-practice";
import { ToolList } from "@/components/tool-list";
import { Hero } from "@/components/hero";
import { Mascot } from "@/components/mascot";
import { Research } from "@/components/research";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Skills, SkillsSkeleton } from "@/components/skills";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// Profile copy is static and prerenders into the shell; the database-backed
// sections stream in behind their own Suspense boundaries.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const s = dict.sections;

  return (
    <>
      <SiteHeader lang={lang} dict={dict} />
      <main>
        <Hero dict={dict} />

        <section aria-label={s.about.title} className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
          <div className="grid gap-x-10 gap-y-6 border-t-2 border-rule pt-10 sm:grid-cols-[10rem_minmax(0,1fr)]">
            <h2 className="text-sm font-semibold">{s.about.title}</h2>
            <div className="max-w-3xl space-y-6">
              <p className="text-2xl font-medium leading-snug tracking-[-0.01em] text-pretty sm:text-3xl sm:leading-snug">
                {dict.profile.about[0]}
              </p>
              {dict.profile.about.slice(1).map((p) => (
                <p key={p} className="text-lg leading-relaxed text-ink-2 text-pretty">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        <Section id="experience" title={s.experience.title}>
          <Suspense fallback={<ExperienceSkeleton />}>
            <Experience lang={lang} dict={dict} />
          </Suspense>
        </Section>

        <Section id="case-studies" title={s.caseStudies.title} meta={s.caseStudies.meta}>
          <CaseStudies lang={lang} dict={dict} />
        </Section>

        <Section id="work" title={s.work.title} meta="kobnub.io">
          <FeaturedProject lang={lang} visitLabel={s.work.visit} />
          <ToolList lang={lang} title={s.work.tools} />
        </Section>

        <Section id="metrics" title={s.metrics.title} meta={s.metrics.meta}>
          <AiPractice lang={lang} />
        </Section>

        <Section id="skills" title={s.skills.title}>
          <Suspense fallback={<SkillsSkeleton />}>
            <Skills dict={dict} />
          </Suspense>
        </Section>

        <Section id="research" title={s.research.title} meta={`${papers.length} ${s.research.count}`}>
          <Research lang={lang} dict={dict} />
        </Section>

        <Section id="contact" title={s.contact.title}>
          <p className="max-w-xl text-lg leading-relaxed text-ink-2 text-pretty">{dict.contact.blurb}</p>
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="mt-8 block break-all text-3xl font-bold tracking-[-0.02em] underline decoration-2 underline-offset-[0.18em] hover:decoration-scan sm:text-6xl"
            >
              {profile.email}
            </a>
          )}
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-lg">
            <li>
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="link">
                github.com/{profile.handle}
              </a>
            </li>
            <li>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="link">
                linkedin.com/in/wassaphas20
              </a>
            </li>
          </ul>
        </Section>
      </main>
      <SiteFooter dict={dict} />
      <Mascot />
    </>
  );
}
