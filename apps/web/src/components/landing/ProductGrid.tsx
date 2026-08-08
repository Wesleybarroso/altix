// ProductGrid component for landing page
'use client';

import React from 'react';
import { useLanguage } from '@/app/lib/i18n';

export default function ProductGrid() {
  const { t } = useLanguage();
  // Placeholder images – using generated UI mockups would be ideal; here we use colored boxes.
  const mockScreens = Array.from({ length: 3 }, (_, i) => i + 1);

  return (
    <section className="py-20 bg-altix-bg text-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t('productGrid.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {mockScreens.map((i) => (
            <div key={i} className="glass-card p-4 flex items-center justify-center h-48">
              <div className="w-32 h-32 bg-altix-green/30 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
