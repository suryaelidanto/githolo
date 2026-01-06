import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'GitHub Vibe Check - Discover Your Developer Personality',
  description:
    'AI analyzes your GitHub commits and reveals your coding personality. Get your developer archetype, strengths, quirks, and a personalized roast.',
  keywords: [
    'GitHub',
    'developer personality',
    'AI analysis',
    'coding style',
    'commit messages',
    'developer archetype',
  ],
  authors: [{ name: 'GitHub Vibe Check' }],
  openGraph: {
    title: 'GitHub Vibe Check - Discover Your Developer Personality',
    description:
      'AI analyzes your GitHub commits and reveals your coding personality. Get your developer archetype and personalized insights.',
    type: 'website',
    url: 'https://github-vibe-check.vercel.app',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GitHub Vibe Check - AI-powered developer personality analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Vibe Check - Discover Your Developer Personality',
    description:
      'AI analyzes your GitHub commits and reveals your coding personality. Get your developer archetype and personalized insights.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased text-[#1D1D1F] bg-[#F5F5F7]`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
