import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
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
        className={`${outfit.variable} font-sans antialiased text-black`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
