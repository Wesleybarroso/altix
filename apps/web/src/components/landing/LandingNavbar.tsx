// Landing Navbar component
'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LandingNavbar() {
  const { t } = useLanguage();
  const navLinks = [
    { href: '#features', label: t('navbar.links.features') },
    { href: '#how-it-works', label: t('navbar.links.howItWorks') },
    { href: '#testimonials', label: t('navbar.links.testimonials') },
    { href: '#pricing', label: t('navbar.links.pricing') },
  ];

  return (
    <header className="fixed top-0 w-full bg-altix-bg/70 backdrop-blur-xl border-b border-white/10 z-30 glass-card">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-altix-green rounded-md flex items-center justify-center text-black font-bold">
            ⚡
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-lg text-white">{t('navbar.brand')}</span>
            <span className="text-xs text-altix-muted">{t('navbar.tagline')}</span>
          </div>
        </div>
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-altix-muted hover:text-altix-green transition-colors">
              {link.label}
            </a>
          ))}
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
