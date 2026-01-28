import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://crew-schedule-six.vercel.app'),
  title: '일정 투표 - 걸뱅이크루',
  description: '걸뱅이크루 모임 일정에 투표해주세요',
  openGraph: {
    title: '걸뱅이크루 일정 투표',
    description: '모임 일정에 투표해주세요!',
    type: 'website',
    locale: 'ko_KR',
    url: 'https://crew-schedule-six.vercel.app',
    images: [
      {
        url: 'https://crew-schedule-six.vercel.app/OGimage.png',
        width: 1200,
        height: 630,
        alt: '걸뱅이크루 일정 관리',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '걸뱅이크루 일정 투표',
    description: '모임 일정에 투표해주세요!',
    images: ['https://crew-schedule-six.vercel.app/OGimage.png'],
  },
};

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
