import { Metadata } from 'next';

// For static exports, we need to define metadata directly
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
        url: 'https://devtypes.vercel.app/api/og?title=My%20DevType%20Result&description=Check%20out%20my%20developer%20personality%20type%20on%20DevType!',
        width: 1200,
        height: 630,
        alt: 'My DevType Result',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My DevType Result | DevType',
    description: 'Check out my developer personality type on DevType!',
    images: ['https://devtypes.vercel.app/api/og?title=My%20DevType%20Result&description=Check%20out%20my%20developer%20personality%20type%20on%20DevType!'],
  },
};
