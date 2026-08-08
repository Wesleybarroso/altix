

import React from 'react';
import dynamic from 'next/dynamic';

const LandingNavbar = dynamic(() => import('@/components/landing/LandingNavbar'));
const Hero = dynamic(() => import('@/components/landing/Hero'));
const Features = dynamic(() => import('@/components/landing/Features'), { ssr: false });
const TrustStripe = dynamic(() => import('@/components/landing/TrustStripe'), { ssr: false });
const ProductGrid = dynamic(() => import('@/components/landing/ProductGrid'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/landing/Testimonials'), { ssr: false });
const Pricing = dynamic(() => import('@/components/landing/Pricing'), { ssr: false });
const FinalCTA = dynamic(() => import('@/components/landing/FinalCTA'), { ssr: false });
const Footer = dynamic(() => import('@/components/landing/Footer'));


export default function LandingPage() {
  return (
    <div className="bg-altix-bg text-white min-h-screen flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <TrustStripe />
        <ProductGrid />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
