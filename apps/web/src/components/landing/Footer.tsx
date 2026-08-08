// Footer component for landing page
'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/lib/i18n';

export default function Footer() {
  const { t } = useLanguage();
  const links = [
    { href: '/#features', label: t('navbar.links.features') },
    { href: '/#how-it-works', label: t('navbar.links.howItWorks') },
    { href: '/#testimonials', label: t('navbar.links.testimonials') },
    { href: '/#pricing', label: t('navbar.links.pricing') },
  ];

  return (
    <footer className="bg-altix-bg text-altix-muted py-8 glass-card">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-white">© {new Date().getFullYear()} ALTIX</span>
        </div>
        <nav className="flex space-x-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-altix-green transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Placeholder social icons */}
        <div className="flex space-x-3 mt-4 md:mt-0">
          <div className="w-6 h-6 bg-altix-green rounded-full" />
          <div className="w-6 h-6 bg-altix-green rounded-full" />
          <div className="w-6 h-6 bg-altix-green rounded-full" />
        </div>
      </div>
    </footer>
  );
}
