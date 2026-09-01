import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Mail, Github, FileText, Linkedin, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import WorkGlobe from '../components/WorkGlobe';
import CityContent from '../components/CityContent';

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

export default function Home() {
    const { t } = useLang();
    usePageTitle();
    const globeRef = useRef(null);

    // City view: the globe stays on screen; the city's content is a
    // sheet that scrolls up over it. Opened by clicking a marker dot.
    // Returning within the session restores the city that was open;
    // a fresh visit starts at the calm rest view.
    const [initialCity] = useState(() => {
        try {
            const saved = sessionStorage.getItem('cityView');
            return saved === 'tokyo' || saved === 'singapore' ? saved : null;
        } catch {
            return null;
        }
    });
    const [cityView, setCityView] = useState(initialCity); // null | 'tokyo' | 'singapore'
    const [sheetState, setSheetState] = useState(initialCity ? 'open' : 'closed'); // closed | open | closing
    const [engaged, setEngaged] = useState(!!initialCity); // globe is flying or a city is open
    const flying = useRef(false);

    const goCity = (city) => {
        if (flying.current) return;
        flying.current = true;
        setEngaged(true);
        globeRef.current?.flyTo(city, () => {
            flying.current = false;
            setCityView(city);
            setSheetState('open');
            try { sessionStorage.setItem('cityView', city); } catch { /* fine */ }
        });
    };

    const closeCity = () => {
        if (flying.current) return;
        setSheetState('closing');
        try { sessionStorage.removeItem('cityView'); } catch { /* fine */ }
        setTimeout(() => {
            setSheetState('closed');
            setCityView(null);
            globeRef.current?.flyBack(() => setEngaged(false));
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
                try { sessionStorage.setItem('cityView', nextCity); } catch { /* fine */ }
            });
        }, 280);
    };

    // Place the globe over the restored city after first paint
    useEffect(() => {
        if (initialCity) {
            requestAnimationFrame(() => globeRef.current?.jumpTo(initialCity));
        }
    }, [initialCity]);

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

    const nextOf = cityView === 'tokyo' ? 'singapore' : 'tokyo';
    const fade = `transition-opacity duration-500 ${engaged ? 'opacity-0' : ''}`;

    const contactLinks = [
        { href: 'mailto:takumi_ot09@fuji.waseda.jp', icon: Mail, label: 'Email' },
        { href: 'https://github.com/ronin207', icon: Github, label: 'GitHub', external: true },
        { href: 'https://linkedin.com/in/takumi-otsuka', icon: Linkedin, label: 'LinkedIn', external: true },
    ];

    return (
        <div className="mx-auto max-w-3xl px-6 pt-20 md:pt-24">
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

            {/* The landing is the room: a nameplate top-left, the globe
                as the centerpiece, a quiet ledger line at the bottom.
                The marker dots are the way in (DESIGN.md §32, §45). */}
            <header id="overview" className="entrance flex flex-col min-h-[calc(100svh-8.5rem)] md:min-h-[calc(100svh-9.5rem)]">
                <div className={`text-left ${fade}`}>
                    <h1 className="text-2xl md:text-[28px] font-medium tracking-[-0.02em] leading-tight text-ink">
                        {t.hero.name}
                    </h1>
                    <p className="text-sm md:text-base font-light text-ink-2 mt-1 max-w-md">
                        {t.hero.statement}
                    </p>
                    <p className="text-xs text-ink-3 leading-relaxed mt-2 max-w-md">
                        {t.hero.description}
                    </p>
                </div>
                <div className="flex-1 w-full flex items-center justify-center py-4">
                    {/* Width capped against viewport height so the globe
                        never pushes the ledger line below the fold */}
                    <div className="w-full" style={{ maxWidth: 'min(680px, calc(100svh - 380px))' }}>
                        <WorkGlobe
                            ref={globeRef}
                            size={680}
                        onCityClick={goCity}
                        engaged={engaged}
                            cityLabels={{ tokyo: t.locations.tokyo.name, singapore: t.locations.singapore.name }}
                        />
                    </div>
                </div>
                <div className={`w-full flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-5 ${fade}`}>
                    <div className="flex items-center gap-5">
                        {contactLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    aria-label={link.label}
                                    className="text-ink-3 hover:text-ink transition-colors"
                                >
                                    <Icon size={17} />
                                </a>
                            );
                        })}
                        <Link to="/cv" aria-label={t.contact.cv_link} className="text-ink-3 hover:text-ink transition-colors">
                            <FileText size={17} />
                        </Link>
                    </div>
                    <p className="text-xs text-ink-3 hidden sm:block">{t.locations.explore}</p>
                    <p className="text-xs text-ink-3">
                        © 2026 {t.footer.copyright} · <TokyoTime />
                    </p>
                </div>
            </header>
        </div>
    );
}
