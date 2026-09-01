import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import CityContent from '../components/CityContent';
import usePageTitle from '../hooks/usePageTitle.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';

// Standalone city page for direct links (command palette, shared URLs).
// The primary experience is the sheet over the globe on the home page.
const CITY_ORDER = ['tokyo', 'singapore'];

export default function LocationDetail() {
  const { city } = useParams();
  const { t } = useLang();

  const loc = t.locations[city];
  usePageTitle(loc?.name);

  if (!loc || !CITY_ORDER.includes(city)) {
    return <Navigate to="/" replace />;
  }

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

      <CityContent city={city} />

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
