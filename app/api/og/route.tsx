import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// This route is statically exported
// @ts-ignore
// Force static export
export const dynamic = 'force-static';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'Developer';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            backgroundImage: 'linear-gradient(to bottom right, #f3e8ff, #e0e7ff)',
            padding: '2rem',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '800px',
              margin: '0 auto',
              padding: '4rem 2rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h1
              style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.2,
              }}
            >
              I'm a {type}!
            </h1>
            <p
              style={{
                fontSize: '1.5rem',
                color: '#4b5563',
                marginBottom: '2rem',
                maxWidth: '600px',
                lineHeight: 1.5,
              }}
            >
              Discover your developer personality at DevType
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2rem',
                padding: '1rem 2rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '9999px',
                fontSize: '1.25rem',
                color: '#4f46e5',
                fontWeight: '600',
              }}
            >
              devtype.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error('Error generating OpenGraph image:', e);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
