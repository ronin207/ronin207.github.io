import React from 'react';
import projects from '../data/projects';
import ProjectRow from './ProjectRow';
import { useLang } from '../i18n/LanguageContext.jsx';

// The substance of a city view — shared by the sheet that scrolls up
// over the zoomed globe (Home) and the standalone /work/:city route.
export default function CityContent({ city }) {
  const { t } = useLang();
  const loc = t.locations[city];
  const cityProjects = projects.filter((p) => p.location === city);

  return (
    <>
      <header className="mb-12">
        <p className="text-xs text-ink-3 mb-3">{loc.period}</p>
        <h1 className="text-4xl md:text-[56px] font-medium tracking-[-0.04em] leading-[1.05] text-ink mb-4">
          {loc.name}
        </h1>
        <p className="text-ink mb-4">{loc.role}</p>
        <p className="text-ink-2 leading-relaxed max-w-xl">{loc.summary}</p>
      </header>

      <section>
        <h2 className="text-sm font-medium text-ink-3 mb-6">{t.locations.work_label}</h2>
        <div>
          {cityProjects.map((project) => (
            <ProjectRow key={project.slug} project={project} viewLabel={t.project.view} />
          ))}
        </div>
      </section>
    </>
  );
}
