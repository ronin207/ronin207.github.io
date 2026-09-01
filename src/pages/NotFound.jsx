import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';

export default function NotFound() {
  usePageTitle('404');
  const { t } = useLang();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-4 text-ink">
          404
        </h1>

        <p className="text-ink-2 leading-relaxed mb-10">
          This page does not exist.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-ink text-canvas hover:opacity-85 transition-opacity"
        >
          <ArrowLeft size={15} />
          <span>{t.return_home}</span>
        </Link>
      </div>
    </div>
  );
}
