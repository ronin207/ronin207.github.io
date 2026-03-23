import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import projects from '../data/projects';
import usePageTitle from '../hooks/usePageTitle.jsx';

export default function ProjectDetail({ resolvedTheme }) {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  usePageTitle(project?.title);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  const Icon = project.icon;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto max-w-4xl">
      {/* Back nav */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-mono text-neutral-500 hover:text-indigo-600 dark:hover:text-emerald-500 transition-colors mb-12"
      >
        <ArrowLeft size={16} />
        <span>RETURN_HOME</span>
      </Link>

      {/* Header */}
      <header className="mb-16 border-b border-neutral-200 dark:border-neutral-800 pb-12">
        <div className="flex items-center gap-3 mb-4">
          <Icon size={20} className={resolvedTheme === 'dark' ? 'text-emerald-500' : 'text-indigo-600'} />
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            {project.category}
          </span>
          <span className="text-xs font-mono text-neutral-400">
            [{project.year}]
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6 text-neutral-900 dark:text-white">
          {project.title}
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light max-w-2xl leading-relaxed">
          {project.description}
        </p>

        {/* Links */}
        <div className="flex gap-4 mt-8">
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-mono rounded-full border transition-colors ${
                resolvedTheme === 'dark'
                  ? 'border-neutral-700 text-neutral-300 hover:border-emerald-500 hover:text-emerald-500'
                  : 'border-neutral-300 text-neutral-600 hover:border-indigo-600 hover:text-indigo-600'
              }`}
            >
              <Github size={16} />
              Source Code
            </a>
          )}
          {project.links?.paper && (
            <a
              href={project.links.paper}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-mono rounded-full border transition-colors ${
                resolvedTheme === 'dark'
                  ? 'border-neutral-700 text-neutral-300 hover:border-emerald-500 hover:text-emerald-500'
                  : 'border-neutral-300 text-neutral-600 hover:border-indigo-600 hover:text-indigo-600'
              }`}
            >
              <ArrowUpRight size={16} />
              Research Paper
            </a>
          )}
        </div>
      </header>

      {/* Tech Stack */}
      <section className="mb-16">
        <h2 className="text-xs font-mono text-neutral-400 dark:text-neutral-500 tracking-widest uppercase mb-6">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className={`px-4 py-1.5 text-sm font-mono rounded-full border ${
                resolvedTheme === 'dark'
                  ? 'bg-neutral-900/50 border-neutral-800 text-neutral-300'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-600'
              }`}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="mb-16">
        <h2 className="text-xs font-mono text-neutral-400 dark:text-neutral-500 tracking-widest uppercase mb-6">
          Problem
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed text-lg">
          {project.problem}
        </p>
      </section>

      {/* Approach */}
      <section className="mb-16">
        <h2 className="text-xs font-mono text-neutral-400 dark:text-neutral-500 tracking-widest uppercase mb-6">
          Technical Approach
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed text-lg">
          {project.approach}
        </p>
      </section>

      {/* Outcomes */}
      <section className="mb-16">
        <h2 className="text-xs font-mono text-neutral-400 dark:text-neutral-500 tracking-widest uppercase mb-6">
          Key Outcomes
        </h2>
        <ul className="space-y-4">
          {project.outcomes.map((outcome, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                resolvedTheme === 'dark' ? 'bg-emerald-500' : 'bg-indigo-600'
              }`} />
              <span className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                {outcome}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer nav */}
      <footer className="mt-20 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-mono text-neutral-500 hover:text-indigo-600 dark:hover:text-emerald-500 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to all projects</span>
        </Link>
      </footer>
    </div>
  );
}
