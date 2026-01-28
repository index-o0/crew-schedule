import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/auth/SessionProvider';

export const metadata: Metadata = {
  title: '걸뱅이크루 일정 관리',
  description: '걸뱅이크루 멤버들의 모임 일정을 쉽게 조율하세요',
  metadataBase: new URL('https://crew-schedule-six.vercel.app'),
  openGraph: {
    title: '걸뱅이크루 일정 관리',
    description: '걸뱅이크루 멤버들의 모임 일정을 쉽게 조율하세요',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/OGimage.png',
        width: 1200,
        height: 630,
        alt: '걸뱅이크루 일정 관리',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '걸뱅이크루 일정 관리',
    description: '걸뱅이크루 멤버들의 모임 일정을 쉽게 조율하세요',
    images: ['/OGimage.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#667eea',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <SessionProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
