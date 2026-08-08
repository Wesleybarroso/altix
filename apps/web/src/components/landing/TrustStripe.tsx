// TrustStripe component for landing page
'use client';

import React from 'react';
import { useLanguage } from '@/app/lib/i18n';

export default function TrustStripe() {
  const { t } = useLanguage();
  return (
    <section className="py-8 bg-altix-bg/50 glass-card">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-xl font-medium text-altix-muted mb-4">{t('trust.title')}</h3>
        {/* Placeholder logos - using simple colored circles */}
        <div className="flex justify-center space-x-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-12 h-12 bg-altix-green rounded-full" />
          ))}
        </div>
      </div>
    </section>
  );
}
