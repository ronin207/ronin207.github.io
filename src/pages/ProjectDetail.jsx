import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Github, ChevronRight } from 'lucide-react';
import projects from '../data/projects';
import usePageTitle from '../hooks/usePageTitle.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';

const SectionHeading = ({ children }) => (
  <h2 className="text-sm font-medium text-ink-3 mb-4">{children}</h2>
);

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t } = useLang();
  const project = projects.find((p) => p.slug === slug);

  usePageTitle(project?.title);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  const hasLinks = project.links?.github || project.links?.paper;

  return (
    <div className="min-h-screen pt-36 md:pt-44 pb-20 px-6 mx-auto max-w-3xl">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-ink-3 hover:text-ink transition-colors mb-14"
      >
        <ArrowLeft size={15} />
        <span>{t.return_home}</span>
      </Link>

      {/* Lead with the question and result (DESIGN.md §33) */}
      <header className="mb-16">
        <p className="text-xs text-ink-3 mb-3">
          {project.category} · {project.year} · {project.status}
        </p>
        <h1 className="text-4xl md:text-[56px] font-medium tracking-[-0.04em] leading-[1.05] text-ink mb-6">
          {project.title}
        </h1>
        <p className="text-lg md:text-xl font-light text-ink leading-relaxed max-w-2xl">
          {project.description}
        </p>
      </header>

      <section className="mb-14">
        <SectionHeading>{t.problem}</SectionHeading>
        <p className="text-ink-2 leading-relaxed max-w-2xl">{project.problem}</p>
      </section>

      <section className="mb-14">
        <SectionHeading>{t.approach}</SectionHeading>
        <p className="text-ink-2 leading-relaxed max-w-2xl">{project.approach}</p>
      </section>

      <section className="mb-14">
        <SectionHeading>{t.outcomes}</SectionHeading>
        <ul className="space-y-3 max-w-2xl">
          {project.outcomes.map((outcome, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2.5 w-1 h-1 rounded-full bg-ink-3 shrink-0" />
              <span className="text-ink-2 leading-relaxed">{outcome}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Technical depth stays behind disclosure (DESIGN.md §17, §46) */}
      <details className="group mb-14 max-w-2xl">
        <summary className="flex items-center gap-1.5 text-sm font-medium text-ink-3 hover:text-ink cursor-pointer list-none transition-colors">
          <ChevronRight size={14} className="transition-transform group-open:rotate-90" />
          {t.technical_details}
        </summary>
        <div className="mt-4 pl-5">
          <p className="text-xs text-ink-3 mb-2">{t.tech_stack}</p>
          <p className="text-sm text-ink-2 leading-relaxed">
            {project.techStack.join(' · ')}
          </p>
        </div>
      </details>

      {hasLinks && (
        <section className="mb-14">
          <SectionHeading>{t.artifacts}</SectionHeading>
          <div className="flex flex-wrap gap-3">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-hairline text-ink-2 hover:text-ink hover:border-ink-3 transition-colors"
              >
                <Github size={15} />
                {t.source_code}
              </a>
            )}
            {project.links?.paper && (
              <a
                href={project.links.paper}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-hairline text-ink-2 hover:text-ink hover:border-ink-3 transition-colors"
              >
                <ArrowUpRight size={15} />
                {t.research_paper}
              </a>
            )}
          </div>
        </section>
      )}

      <footer className="mt-20 pt-8 border-t border-hairline">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-ink-3 hover:text-ink transition-colors"
        >
          <ArrowLeft size={15} />
          <span>{t.back_to_projects}</span>
        </Link>
      </footer>
    </div>
  );
}
