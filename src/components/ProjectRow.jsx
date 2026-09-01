import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const ProjectRow = ({ project, viewLabel }) => (
    <Link
        to={`/projects/${project.slug}`}
        className="group block py-10 border-t border-hairline -mx-5 px-5 rounded-2xl hover:bg-surface/70 transition-colors duration-300"
    >
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 mb-3">
            <h3 className="text-xl font-medium tracking-[-0.02em] text-ink group-hover:text-accent transition-colors">
                {project.title}
            </h3>
            <p className="text-xs text-ink-3">
                {project.year} · {project.category} · {project.status}
            </p>
        </div>
        <p className="text-ink-2 leading-relaxed max-w-2xl mb-1.5">
            {project.problemShort}
        </p>
        <p className="text-ink-2 leading-relaxed max-w-2xl">
            {project.contributionShort}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent">
            {viewLabel}
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
    </Link>
);

export default ProjectRow;
