import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Mail, Github, FileText, Linkedin, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useInView from '../hooks/useInView.jsx';
import projects from '../data/projects';
import usePageTitle from '../hooks/usePageTitle.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import WorkGlobe from '../components/WorkGlobe';
import ProjectRow from '../components/ProjectRow';
import CityContent from '../components/CityContent';

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

// The room is in Tokyo; the clock in it is real (benji.org pattern —
// a live, factual detail rather than decorative motion).
const TokyoTime = () => {
    const { lang } = useLang();
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const tick = () => setNow(new Date());
        const msToNextMinute = 60000 - (Date.now() % 60000);
        let interval;
        const timeout = setTimeout(() => {
            tick();
            interval = setInterval(tick, 60000);
        }, msToNextMinute);
        return () => { clearTimeout(timeout); clearInterval(interval); };
    }, []);

    const time = new Intl.DateTimeFormat(lang === 'ja' ? 'ja-JP' : 'en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Tokyo',
    }).format(now);

    return <span>{lang === 'ja' ? `東京 ${time}` : `${time} in Tokyo`}</span>;
};

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
    const globeRef = useRef(null);
    const selected = projects.filter((p) => p.selected);
    const other = projects.filter((p) => !p.selected);

    // City view: the globe stays on screen; the city's content is a
    // sheet that scrolls up over it. No route change, no hard cut.
    const [cityView, setCityView] = useState(null); // null | 'tokyo' | 'singapore'
    const [sheetState, setSheetState] = useState('closed'); // closed | open | closing
    const flying = useRef(false);

    const goCity = (city) => {
        if (flying.current) return;
        flying.current = true;
        globeRef.current?.flyTo(city, () => {
            flying.current = false;
            setCityView(city);
            setSheetState('open');
        });
    };

    const closeCity = () => {
        if (flying.current) return;
        setSheetState('closing');
        setTimeout(() => {
            setSheetState('closed');
            setCityView(null);
            globeRef.current?.flyBack();
        }, 280);
    };

    const goNext = (nextCity) => {
        if (flying.current) return;
        setSheetState('closing');
        setTimeout(() => {
            setCityView(null);
            flying.current = true;
            globeRef.current?.flyTo(nextCity, () => {
                flying.current = false;
                setCityView(nextCity);
                setSheetState('open');
            });
        }, 280);
    };

    // While the sheet is up: lock the page scroll, close on Escape
    useEffect(() => {
        if (!cityView) return;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => { if (e.key === 'Escape') closeCity(); };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [cityView]);

    const contactLinks = [
        { href: 'mailto:takumi_ot09@fuji.waseda.jp', icon: Mail, label: 'takumi_ot09@fuji.waseda.jp' },
        { href: 'https://github.com/ronin207', icon: Github, label: 'github.com/ronin207', external: true },
        { href: 'https://linkedin.com/in/takumi-otsuka', icon: Linkedin, label: 'linkedin.com/in/takumi-otsuka', external: true },
    ];

    const nextOf = cityView === 'tokyo' ? 'singapore' : 'tokyo';

    return (
        <div className="mx-auto max-w-3xl px-6 pt-40 md:pt-52">
            {/* City sheet — scrolls up over the zoomed globe. The spacer
                at the top keeps the city in view; clicking it closes. */}
            {cityView && createPortal(
                <div className={`fixed inset-0 z-[45] overflow-y-auto overscroll-contain ${sheetState === 'closing' ? 'sheet-leave' : 'sheet-enter'}`}>
                    <div className="h-[38vh] min-h-[180px]" onClick={closeCity} aria-hidden="true" />
                    <div className="city-sheet">
                        <div className="max-w-3xl mx-auto px-6 pt-6 pb-24">
                            <div className="flex items-center justify-between mb-10">
                                <button
                                    onClick={closeCity}
                                    className="p-2 -ml-2 rounded-full text-ink-3 hover:text-ink hover:bg-mist transition-colors"
                                    aria-label={t.locations.close}
                                >
                                    <X size={18} />
                                </button>
                                <button
                                    onClick={() => goNext(nextOf)}
                                    className="inline-flex items-center gap-2 text-sm text-ink-3 hover:text-ink transition-colors"
                                >
                                    <span>{t.locations.next}: {t.locations[nextOf].name}</span>
                                    <ArrowRight size={15} />
                                </button>
                            </div>
                            <CityContent city={cityView} />
                            <div className="mt-16 pt-8 border-t border-hairline flex items-center justify-between">
                                <button onClick={closeCity} className="text-sm text-ink-3 hover:text-ink transition-colors">
                                    {t.locations.close}
                                </button>
                                <button
                                    onClick={() => goNext(nextOf)}
                                    className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-strong transition-colors"
                                >
                                    <span>{t.locations.next}: {t.locations[nextOf].name}</span>
                                    <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            {/* Hero — the globe as the room's centerpiece. Name and
                statement stay first (DESIGN.md §32); the globe is a lens
                into the work, never a gate: everything remains reachable
                by scrolling. Entrance choreography plays on first visit. */}
            <header id="overview" className="entrance mb-24 md:mb-32 flex flex-col items-center text-center">
                <h1 className="text-5xl md:text-[64px] font-medium tracking-[-0.04em] leading-[1.05] text-ink mb-6">
                    {t.hero.name}
                </h1>
                <p className="text-2xl md:text-[28px] font-light tracking-[-0.015em] leading-snug text-ink mb-5 max-w-xl">
                    {t.hero.statement}
                </p>
                <p className="text-ink-2 leading-relaxed mb-6 max-w-xl">
                    {t.hero.description}
                </p>
                <div className="w-full flex justify-center">
                    <WorkGlobe ref={globeRef} size={400} />
                </div>
                <p className="text-xs text-ink-3 mt-5 mb-4">{t.locations.explore}</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {['tokyo', 'singapore'].map((city) => (
                        <button
                            key={city}
                            onClick={() => goCity(city)}
                            className="px-5 py-2.5 text-sm rounded-xl bg-surface border border-hairline text-ink-2 hover:text-ink active:scale-[0.98] transition-all"
                            style={{ boxShadow: 'var(--shadow-low)' }}
                        >
                            {t.locations[city].button}
                        </button>
                    ))}
                </div>
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
                    © 2026 {t.footer.copyright} · <TokyoTime />
                </p>
            </footer>
        </div>
    );
}
