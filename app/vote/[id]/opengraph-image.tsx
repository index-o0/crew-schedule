import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '걸뱅이크루 일정 관리';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            borderRadius: '24px',
            padding: '60px 80px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 20px 0',
            }}
          >
            걸뱅이크루 일정 관리
          </h1>
          <p
            style={{
              fontSize: '36px',
              color: '#6b7280',
              margin: 0,
            }}
          >
            모임 일정을 쉽게 조율하세요
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
