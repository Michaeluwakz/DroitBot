
// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import MainLayout from '@/components/layout/main-layout';
import { LanguageProvider } from '@/contexts/language-context';

export const metadata: Metadata = {
  title: 'DroitBot',
  description: 'Your AI-powered legal and safety assistant for Tunisia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        {/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
      </head>
      <body className="font-body antialiased break-words">
        <LanguageProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
