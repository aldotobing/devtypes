import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params: { locale },
  searchParams,
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  // Get the result type from query params if available
  const type = searchParams.type as string || 'Developer';
  const description = t('resultDescription', { type });
  
  return {
    title: `${type} - ${t('title')}`,
    description,
    openGraph: {
      title: `${type} - ${t('title')}`,
      description,
      url: `https://devtype.vercel.app/result?type=${encodeURIComponent(type)}`,
      siteName: 'DevType',
      images: [
        {
          url: `https://devtype.vercel.app/api/og?type=${encodeURIComponent(type)}`,
          width: 1200,
          height: 630,
          alt: `${type} - ${t('title')}`,
        },
      ],
      locale: locale || 'en',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${type} - ${t('title')}`,
      description,
      images: [`https://devtype.vercel.app/api/og?type=${encodeURIComponent(type)}`],
    },
  };
}
