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

// Profile copy is static and prerenders into the shell; the database-backed
// sections stream in behind their own Suspense boundaries.
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />

        <Section id="about" eyebrow="About" title="Full stack, end to end">
          <div className="max-w-2xl space-y-4 leading-relaxed text-pretty">
            {profile.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Section>

        <Section id="skills" eyebrow="Skills" title="What I work with">
          <Suspense fallback={<SkillsSkeleton />}>
            <Skills />
          </Suspense>
        </Section>

        <Section id="projects" eyebrow="Projects" title="Selected work">
          <Suspense fallback={<ProjectsSkeleton />}>
            <Projects />
          </Suspense>
        </Section>

        <Section id="experience" eyebrow="Experience" title="Where I've worked">
          <Suspense fallback={<ExperienceSkeleton />}>
            <Experience />
          </Suspense>
        </Section>

        <Section id="contact" eyebrow="Contact" title="Let's talk">
          <div className="grid gap-8 md:grid-cols-[1fr_1.6fr]">
            <div className="space-y-4 text-sm leading-relaxed">
              <p>Hiring for a full-stack or AI engineering role, or have a project in mind? Send a message and I&apos;ll reply by email.</p>
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
            <ContactForm />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
