// Pricing component for landing page
'use client';

import React from 'react';
import { useLanguage } from '@/app/lib/i18n';

export default function Pricing() {
  const raw = t('pricing.tiers', { returnObjects: true });
  const tiers = Array.isArray(raw) ? (raw as Array<{ name: string; price: string; features: any }>) : [];


  return (
    <section id="pricing" className="py-20 bg-altix-bg text-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t('pricing.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div key={idx} className="glass-card p-6 flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2 text-altix-green">{tier.name}</h3>
              <p className="text-2xl font-bold mb-4">{tier.price}</p>
              <ul className="mb-4 space-y-2 text-left">
                {(Array.isArray(tier.features) ? tier.features : []).map((feat, i) => (
                  <li key={i} className="text-altix-muted">• {feat}</li>
                ))}
              </ul>
              <button className="px-4 py-2 bg-altix-green text-black rounded hover:bg-altix-green-light transition">
                {t('pricing.cta') || 'Start Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
