import React, { useState } from 'react';
import { ArrowUpRight, Mail, Github, FileText, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import useInView from '../hooks/useInView.jsx';
import projects from '../data/projects';
import usePageTitle from '../hooks/usePageTitle.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';

const FadeIn = ({ children, className = '', delay = 0 }) => {
    const [ref, isInView] = useInView();
    return (
        <div
            ref={ref}
            className={`transition-all duration-500 ease-out ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const SectionHeading = ({ children }) => (
    <h2 className="text-sm font-medium text-ink-3 mb-10">{children}</h2>
);

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

const ResearchPanel = ({ label, title, status, description, facts }) => (
    <div className="bg-surface/80 backdrop-blur-md border border-hairline rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-5">
            <div>
                <p className="text-xs text-ink-3 mb-1">{label}</p>
                <h3 className="text-xl font-medium text-ink">{title}</h3>
            </div>
            <span className="text-xs text-ink-3">{status}</span>
        </div>

        <p className="text-ink-2 leading-relaxed mb-7 max-w-2xl">{description}</p>

        <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 pt-5 border-t border-hairline">
            {facts.map(([term, value]) => (
                <div key={term}>
                    <dt className="text-xs text-ink-3 mb-1">{term}</dt>
                    <dd className="text-sm text-ink">{value}</dd>
                </div>
            ))}
        </dl>
    </div>
);

const Field = ({ label, children }) => (
    <label className="block">
        <span className="block text-xs text-ink-3 mb-1.5">{label}</span>
        {children}
    </label>
);

const ContactForm = () => {
    const { t } = useLang();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('sent');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 4000);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const inputClasses = 'w-full px-4 py-2.5 text-sm rounded-xl bg-mist border border-hairline text-ink placeholder-ink-3 outline-none transition-colors focus:border-accent';

    return (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label={t.contact.form.name}>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={inputClasses}
                    />
                </Field>
                <Field label={t.contact.form.email}>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={inputClasses}
                    />
                </Field>
            </div>
            <Field label={t.contact.form.message}>
                <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`${inputClasses} resize-none`}
                />
            </Field>
            <button
                type="submit"
                disabled={status === 'sending'}
                className="px-6 py-2.5 text-sm font-medium rounded-xl bg-ink text-canvas hover:opacity-85 disabled:opacity-50 transition-opacity"
            >
                {status === 'sending' ? t.contact.form.sending : status === 'sent' ? t.contact.form.sent : t.contact.form.send}
            </button>
            {status === 'error' && (
                <p className="text-sm text-ink-2">{t.contact.form.error}</p>
            )}
        </form>
    );
};

export default function Home() {
    const { t } = useLang();
    usePageTitle();
    const selected = projects.filter((p) => p.selected);
    const other = projects.filter((p) => !p.selected);

    const contactLinks = [
        { href: 'mailto:takumi_ot09@fuji.waseda.jp', icon: Mail, label: 'takumi_ot09@fuji.waseda.jp' },
        { href: 'https://github.com/ronin207', icon: Github, label: 'github.com/ronin207', external: true },
        { href: 'https://linkedin.com/in/takumi-otsuka', icon: Linkedin, label: 'linkedin.com/in/takumi-otsuka', external: true },
    ];

    return (
        <div className="mx-auto max-w-3xl px-6 pt-40 md:pt-52">
            {/* Hero — restrained landing (DESIGN.md §32, §35) */}
            <header id="overview" className="mb-28 md:mb-36">
                <FadeIn>
                    <h1 className="text-5xl md:text-[64px] font-medium tracking-[-0.04em] leading-[1.05] text-ink mb-7">
                        {t.hero.name}
                    </h1>
                </FadeIn>
                <FadeIn delay={80}>
                    <p className="text-2xl md:text-[28px] font-light tracking-[-0.015em] leading-snug text-ink mb-6 max-w-xl">
                        {t.hero.statement}
                    </p>
                </FadeIn>
                <FadeIn delay={160}>
                    <p className="text-ink-2 leading-relaxed mb-10 max-w-xl">
                        {t.hero.description}
                    </p>
                </FadeIn>
                <FadeIn delay={240}>
                    <div className="flex items-center gap-4">
                        <a
                            href="#work"
                            className="px-5 py-2.5 text-sm font-medium rounded-xl bg-ink text-canvas hover:opacity-85 active:scale-[0.98] transition-all"
                        >
                            {t.hero.cta_primary}
                        </a>
                        <a
                            href="#contact"
                            className="px-5 py-2.5 text-sm rounded-xl bg-surface border border-hairline text-ink-2 hover:text-ink active:scale-[0.98] transition-all"
                            style={{ boxShadow: 'var(--shadow-low)' }}
                        >
                            {t.hero.cta_secondary}
                        </a>
                    </div>
                </FadeIn>
            </header>

            {/* Selected work */}
            <section id="work" className="mb-28 md:mb-36 scroll-mt-24">
                <FadeIn>
                    <SectionHeading>{t.sections.research}</SectionHeading>
                </FadeIn>
                <div>
                    {selected.map((project, i) => (
                        <FadeIn key={project.slug} delay={Math.min(i * 60, 180)}>
                            <ProjectRow project={project} viewLabel={t.project.view} />
                        </FadeIn>
                    ))}
                </div>

                {other.length > 0 && (
                    <FadeIn>
                        <div className="mt-4 pt-6 border-t border-hairline">
                            <p className="text-xs text-ink-3 mb-3">{t.project.also}</p>
                            {other.map((project) => (
                                <Link
                                    key={project.slug}
                                    to={`/projects/${project.slug}`}
                                    className="group inline-flex items-baseline gap-3 text-sm text-ink-2 hover:text-accent transition-colors"
                                >
                                    <span className="font-medium">{project.title}</span>
                                    <span className="text-xs text-ink-3">{project.year} · {project.category}</span>
                                </Link>
                            ))}
                        </div>
                    </FadeIn>
                )}
            </section>

            {/* Current research */}
            <section id="thesis" className="mb-28 md:mb-36 scroll-mt-24">
                <FadeIn>
                    <SectionHeading>{t.sections.active_research}</SectionHeading>
                </FadeIn>
                <div className="space-y-6">
                    <FadeIn>
                        <ResearchPanel
                            label={t.thesis.label}
                            title={t.thesis.title}
                            status={t.thesis.status}
                            description={t.thesis.description}
                            facts={[
                                [t.focus_area, t.thesis.focus],
                                [t.key_protocol, t.thesis.protocol],
                                [t.application, t.thesis.application],
                            ]}
                        />
                    </FadeIn>
                    <FadeIn delay={80}>
                        <ResearchPanel
                            label={t.vcldac.label}
                            title={t.vcldac.title}
                            status={t.vcldac.status}
                            description={t.vcldac.description}
                            facts={[
                                [t.focus_area, t.vcldac.focus],
                                [t.architecture, t.vcldac.architecture],
                                [t.verification, t.vcldac.verification],
                            ]}
                        />
                    </FadeIn>
                </div>
            </section>

            {/* Background */}
            <section id="about" className="mb-28 md:mb-36 scroll-mt-24">
                <FadeIn>
                    <SectionHeading>{t.sections.philosophy}</SectionHeading>
                </FadeIn>
                <FadeIn>
                    <div className="max-w-2xl space-y-5 text-ink-2 leading-relaxed">
                        <p>{t.philosophy.p1}</p>
                        <p>{t.philosophy.p2}</p>
                        <p className="pt-2 text-sm">
                            <span className="block text-xs text-ink-3 mb-1.5">{t.philosophy.stack_label}</span>
                            Rust, C++, Python, Swift, LEAN 4, LaTeX, MATLAB, Julia, React
                        </p>
                    </div>
                </FadeIn>
            </section>

            {/* Contact */}
            <footer id="contact" className="pb-16 scroll-mt-24">
                <FadeIn>
                    <SectionHeading>{t.contact.title}</SectionHeading>
                    <p className="text-ink-2 leading-relaxed mb-10 max-w-xl">
                        {t.contact.subtitle}
                    </p>
                </FadeIn>

                <FadeIn delay={80}>
                    <ContactForm />
                </FadeIn>

                <FadeIn delay={140}>
                    <div className="flex flex-col md:flex-row flex-wrap gap-5 md:gap-10 mt-14 pt-8 border-t border-hairline">
                        {contactLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    className="flex items-center gap-2.5 text-sm text-ink-2 hover:text-accent transition-colors"
                                >
                                    <Icon size={15} />
                                    <span>{link.label}</span>
                                </a>
                            );
                        })}
                        <Link to="/cv" className="flex items-center gap-2.5 text-sm text-ink-2 hover:text-accent transition-colors">
                            <FileText size={15} />
                            <span>{t.contact.cv_link}</span>
                        </Link>
                    </div>
                </FadeIn>

                <p className="mt-16 text-xs text-ink-3">
                    © 2026 {t.footer.copyright}
                </p>
            </footer>
        </div>
    );
}
