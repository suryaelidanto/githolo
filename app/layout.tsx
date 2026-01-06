import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'EchoWrite - Find Your AI Voice',
  description:
    'Discover your unique LinkedIn writing style and let AI generate posts that sound exactly like you. Free, no login required.',
  keywords: [
    'LinkedIn',
    'AI writing',
    'content generation',
    'writing style',
    'social media',
    'LangChain',
  ],
  authors: [{ name: 'EchoWrite Team' }],
  openGraph: {
    title: 'EchoWrite - Find Your AI Voice',
    description:
      'Discover your unique LinkedIn writing style and let AI generate posts that sound exactly like you.',
    type: 'website',
    url: 'https://echowrite.ai',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EchoWrite - AI-powered LinkedIn writing assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EchoWrite - Find Your AI Voice',
    description:
      'Discover your unique LinkedIn writing style and let AI generate posts that sound exactly like you.',
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
      <body className={`${outfit.variable} font-sans antialiased text-black`}>{children}</body>
    </html>
  );
}
