// Testimonials component for landing page
'use client';

import React from 'react';
import { useLanguage } from '@/app/lib/i18n';

export default function Testimonials() {
  const raw = t('testimonials.items', { returnObjects: true });
  const testimonials = Array.isArray(raw) ? (raw as Array<{ name: string; quote: string }>) : [];


  // Simple placeholder if no items
  const placeholder = [
    { name: 'Alice', quote: 'ALTIX salva o nosso dia a dia!' },
    { name: 'Bob', quote: 'Alertas de neon são incríveis.' },
    { name: 'Carol', quote: 'Nunca mais tive downtime inesperado.' },
  ];
  const list = testimonials?.length ? testimonials : placeholder;

  return (
    <section id="testimonials" className="py-20 bg-altix-bg text-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t('testimonials.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {list.map((item, idx) => (
            <div key={idx} className="glass-card p-6 text-center">
              <p className="text-altix-muted mb-4">\"{item.quote}\"</p>
              <p className="font-semibold text-altix-green">- {item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
