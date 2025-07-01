import { Metadata } from 'next';

type Props = {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params: { locale },
  searchParams,
}: Props): Promise<Metadata> {
  // Get the result type from query params if available
  const type = (searchParams.type as string) || 'Developer';
  const description = `Discover your developer personality type: ${type}. Take the quiz to find out yours!`;
  
  // For static exports, we need to ensure the URLs are absolute
  const baseUrl = 'https://devtypes.vercel.app';
  const imageUrl = `${baseUrl}/api/og?type=${encodeURIComponent(type)}`;
  const pageUrl = `${baseUrl}/result?type=${encodeURIComponent(type)}`;
  
  return {
    title: `${type} - DevType`,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: `${type} - DevType`,
      description,
      url: pageUrl,
      siteName: 'DevType',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${type} - DevType`,
        },
      ],
      locale: locale || 'en',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${type} - DevType`,
      description,
      images: [imageUrl],
    },
    // Add this to ensure proper static export
    alternates: {
      canonical: pageUrl,
    },
  };
}

// Ensure this page is statically generated
export const dynamic = 'force-static';

// Revalidate the page every hour (optional, for ISR)
export const revalidate = 3600;
