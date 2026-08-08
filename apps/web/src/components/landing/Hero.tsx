// Hero component for landing page
'use client';

import React from 'react';
import { useLanguage } from '@/app/lib/i18n';
import Link from 'next/link';

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative bg-altix-bg py-24 text-center glass-card mt-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          {t('hero.title')}
        </h1>
        <p className="text-xl text-altix-muted mb-8">
          {t('hero.subtitle')}
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-8 py-3 bg-altix-green text-black font-semibold rounded-lg hover:bg-altix-green-light transition"
        >
          {t('hero.cta')}
        </Link>
      </div>
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-altix-green/20 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
