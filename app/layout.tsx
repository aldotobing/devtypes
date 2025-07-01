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
    url: 'https://devtypes.vercel.app', // Replace with your actual domain
    siteName: 'DevType',
    images: [
      {
        url: '/og-image.png', // This will be served from the public directory
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
    images: ['/og-image.png'], // This will be served from the public directory
  },
  metadataBase: new URL('https://devtypes.vercel.app'), // Replace with your actual domain
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