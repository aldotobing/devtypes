import { Metadata } from 'next';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  // Get the result data - you might need to fetch this from your API or context
  // For now, we'll use a generic title and description
  const title = 'My DevType Result | DevType';
  const description = 'Check out my developer personality type on DevType!';
  const imageUrl = `https://devtypes.vercel.app/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://devtypes.vercel.app/result`,
      siteName: 'DevType',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
