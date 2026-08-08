// Features component for landing page
'use client';

import React from 'react';
import { useLanguage } from '@/app/lib/i18n';

export default function Features() {
  const { t } = useLanguage();
  const raw = t('features.items', { returnObjects: true });
  const features = Array.isArray(raw) ? (raw as Array<{ title: string; description: string }>) : [];

  return (
    <section id="features" className="py-20 bg-altix-bg text-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t('features.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="glass-card p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-altix-green">{feat.title}</h3>
              <p className="text-altix-muted">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
