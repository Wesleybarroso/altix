// FinalCTA component for landing page
'use client';

import React from 'react';
import { useLanguage } from '@/app/lib/i18n';
import Link from 'next/link';

export default function FinalCTA() {
  const { t } = useLanguage();
  return (
    <section className="py-20 bg-altix-bg text-white glass-card text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {t('finalCTA.title')}
        </h2>
        <p className="text-xl text-altix-muted mb-8">
          {t('finalCTA.subtitle')}
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-8 py-3 bg-altix-green text-black font-semibold rounded-lg hover:bg-altix-green-light transition"
        >
          {t('finalCTA.cta')}
        </Link>
      </div>
    </section>
  );
}
