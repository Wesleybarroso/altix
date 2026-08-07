import React from 'react';
import './globals.css';
import { CommandPalette } from '@/components/CommandPalette';

export const metadata = {
  title: 'ALTIX - Monitoramento Inteligente. Disponibilidade em Tempo Real.',
  description: 'Plataforma SaaS profissional de monitoramento de disponibilidade de sites, APIs, servidores, SSL e infraestrutura distribuída.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-altix-bg text-white min-h-screen selection:bg-altix-green selection:text-black">
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
