import { notFound } from "next/navigation";
import { Suspense } from "react";
import { profile } from "@/content/profile";
import { ContactForm } from "@/components/contact-form";
import { Experience, ExperienceSkeleton } from "@/components/experience";
import { Hero } from "@/components/hero";
import { GitHubIcon, MailIcon } from "@/components/icons";
import { Projects, ProjectsSkeleton } from "@/components/projects";
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

        <Section id="about" eyebrow={s.about.eyebrow} title={s.about.title}>
          <div className="max-w-2xl space-y-4 leading-relaxed text-pretty">
            {dict.profile.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Section>

        <Section id="skills" eyebrow={s.skills.eyebrow} title={s.skills.title}>
          <Suspense fallback={<SkillsSkeleton />}>
            <Skills dict={dict} />
          </Suspense>
        </Section>

        <Section id="projects" eyebrow={s.projects.eyebrow} title={s.projects.title}>
          <Suspense fallback={<ProjectsSkeleton />}>
            <Projects lang={lang} dict={dict} />
          </Suspense>
        </Section>

        <Section id="experience" eyebrow={s.experience.eyebrow} title={s.experience.title}>
          <Suspense fallback={<ExperienceSkeleton />}>
            <Experience lang={lang} />
          </Suspense>
        </Section>

        <Section id="contact" eyebrow={s.contact.eyebrow} title={s.contact.title}>
          <div className="grid gap-8 md:grid-cols-[1fr_1.6fr]">
            <div className="space-y-4 text-sm leading-relaxed">
              <p>{dict.contact.blurb}</p>
              <ul className="space-y-2">
                {profile.email && (
                  <li>
                    <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 text-muted hover:text-text">
                      <MailIcon /> {profile.email}
                    </a>
                  </li>
                )}
                <li>
                  <a href={profile.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-text">
                    <GitHubIcon /> github.com/{profile.handle}
                  </a>
                </li>
              </ul>
            </div>
            <ContactForm copy={dict.contact} />
          </div>
        </Section>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
