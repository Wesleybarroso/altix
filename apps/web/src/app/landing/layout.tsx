// Landing page layout with SEO meta tags
import '../../styles/globals.css';
import { ReactNode } from 'react';
import Head from 'next/head';
export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>ALTIX – Your SaaS Platform</title>
        <meta name="description" content="ALTIX is a premium SaaS solution with dark neon design." />
        <meta property="og:title" content="ALTIX – Your SaaS Platform" />
        <meta property="og:description" content="ALTIX is a premium SaaS solution with dark neon design." />
        <meta property="og:type" content="website" />
        <html lang="pt-BR" />
      </Head>
      {children}
    </>
  );
}
