import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '@/lib/language-context';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevType - Discover Your Developer Personality',
  description: 'Take the ultimate developer personality test and discover what type of coder you really are. Built for developers, by developers.',
  openGraph: {
    title: 'DevType - Discover Your Developer Personality',
    description: 'Take the ultimate developer personality test and discover what type of coder you really are. Built for developers, by developers.',
    url: 'https://devtypes.vercel.app',
    siteName: 'DevType',
    images: [
      {
        url: 'https://devtypes.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DevType - Discover Your Developer Personality',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevType - Discover Your Developer Personality',
    description: 'Take the ultimate developer personality test and discover what type of coder you really are.',
    images: ['https://devtypes.vercel.app/og-image.png'],
  },
  metadataBase: new URL('https://devtypes.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <LanguageProvider>
          <div className="flex-grow bg-gradient-to-br from-slate-50 to-purple-50">
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}