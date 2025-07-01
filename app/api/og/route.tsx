import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'DevType - Discover Your Developer Personality';
    const description = searchParams.get('description') || 'Take the ultimate developer personality test';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #4f46e5, #7c3aed)',
            color: 'white',
            padding: '0 80px',
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
            {title}
          </div>
          <div style={{ fontSize: 32, opacity: 0.9, maxWidth: '80%' }}>
            {description}
          </div>
          <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: 24 }}>
            devtypes.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
