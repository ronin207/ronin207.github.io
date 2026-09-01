import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import projects from '../data/projects';
import ProjectRow from '../components/ProjectRow';
import WorkGlobe from '../components/WorkGlobe';
import usePageTitle from '../hooks/usePageTitle.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';

const CITY_ORDER = ['tokyo', 'singapore'];

export default function LocationDetail() {
  const { city } = useParams();
  const { t } = useLang();

  const loc = t.locations[city];
  usePageTitle(loc?.name);

  if (!loc || !CITY_ORDER.includes(city)) {
    return <Navigate to="/" replace />;
  }

  const cityProjects = projects.filter((p) => p.location === city);
  const nextCity = CITY_ORDER[(CITY_ORDER.indexOf(city) + 1) % CITY_ORDER.length];

  return (
    <div className="min-h-screen pt-36 md:pt-44 pb-20 px-6 mx-auto max-w-3xl">
      <div className="flex items-center justify-between mb-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-ink-3 hover:text-ink transition-colors"
        >
          <ArrowLeft size={15} />
          <span>{t.locations.close}</span>
        </Link>
        <Link
          to={`/work/${nextCity}`}
          className="inline-flex items-center gap-2 text-sm text-ink-3 hover:text-ink transition-colors"
        >
          <span>{t.locations.next}: {t.locations[nextCity].name}</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* Arrival: the city the globe flew into */}
      <header className="entrance mb-14">
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="text-xs text-ink-3 mb-3">{loc.period}</p>
            <h1 className="text-4xl md:text-[56px] font-medium tracking-[-0.04em] leading-[1.05] text-ink mb-4">
              {loc.name}
            </h1>
            <p className="text-ink mb-4">{loc.role}</p>
            <p className="text-ink-2 leading-relaxed max-w-xl">{loc.summary}</p>
          </div>
          <div className="hidden md:block shrink-0 w-[150px]">
            <WorkGlobe size={150} focus={city} interactive={false} />
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-sm font-medium text-ink-3 mb-6">{t.locations.work_label}</h2>
        <div>
          {cityProjects.map((project) => (
            <ProjectRow key={project.slug} project={project} viewLabel={t.project.view} />
          ))}
        </div>
      </section>

      <footer className="mt-20 pt-8 border-t border-hairline flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-ink-3 hover:text-ink transition-colors"
        >
          <ArrowLeft size={15} />
          <span>{t.locations.close}</span>
        </Link>
        <Link
          to={`/work/${nextCity}`}
          className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-strong transition-colors"
        >
          <span>{t.locations.next}: {t.locations[nextCity].name}</span>
          <ArrowRight size={15} />
        </Link>
      </footer>
    </div>
  );
}
