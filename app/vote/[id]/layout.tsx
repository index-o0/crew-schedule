import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '일정 투표 - 걸뱅이크루',
  description: '걸뱅이크루 모임 일정에 투표해주세요',
  openGraph: {
    title: '걸뱅이크루 일정 투표',
    description: '모임 일정에 투표해주세요!',
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
    title: '걸뱅이크루 일정 투표',
    description: '모임 일정에 투표해주세요!',
    images: ['/OGimage.png'],
  },
};

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
