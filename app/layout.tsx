import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'GitHolo - Discover Your Developer Identity',
  description:
    'AI analyzes your GitHub commits and reveals your coding identity. Get your unique developer archetype and holographic identity card.',
  keywords: [
    'GitHub',
    'developer personality',
    'AI analysis',
    'coding style',
    'commit messages',
    'developer archetype',
  ],
  authors: [{ name: 'GitHolo' }],
  openGraph: {
    title: 'GitHolo - Discover Your Developer Identity',
    description:
      'AI analyzes your GitHub commits and reveals your coding identity. Get your unique developer archetype and holographic identity card.',
    type: 'website',
    url: 'https://githolo.vercel.app',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GitHolo - AI-powered developer identity analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHolo - Discover Your Developer Identity',
    description:
      'AI analyzes your GitHub commits and reveals your coding identity. Get your unique developer archetype and holographic identity card.',
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
