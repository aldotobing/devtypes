import { Metadata } from 'next';

// For static exports, we use a static image for social sharing
export const metadata: Metadata = {
  title: 'My DevType Result | DevType',
  description: 'Check out my developer personality type on DevType!',
  openGraph: {
    title: 'My DevType Result | DevType',
    description: 'Check out my developer personality type on DevType!',
    url: 'https://devtypes.vercel.app/result',
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
    title: 'My DevType Result | DevType',
    description: 'Check out my developer personality type on DevType!',
    images: ['/og-image.png'],
  },
};
