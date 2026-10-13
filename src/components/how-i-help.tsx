import type { Dictionary } from "@/i18n/dictionaries";
import { HelpTabs } from "./help-tabs";

// Right after About: the reader picks their own team and gets the part that fits them.
// Same ruled, two-column frame as the About block above it.
export function HowIHelp({ dict }: { dict: Dictionary }) {
  return (
    <section id="help" aria-labelledby="help-title" className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6">
      <div className="grid gap-x-10 gap-y-6 border-t-2 border-rule pt-10 sm:grid-cols-[10rem_minmax(0,1fr)]">
        <h2 id="help-title" className="text-sm font-semibold">
          {dict.sections.help.title}
        </h2>
        <HelpTabs items={dict.help} label={dict.sections.help.prompt} />
      </div>
    </section>
  );
}
