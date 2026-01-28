import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '투표 결과 - 걸뱅이크루',
  description: '걸뱅이크루 모임 일정 투표 결과를 확인하세요',
  openGraph: {
    title: '걸뱅이크루 투표 결과',
    description: '모임 일정 투표 결과를 확인하세요!',
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
    title: '걸뱅이크루 투표 결과',
    description: '모임 일정 투표 결과를 확인하세요!',
    images: ['/OGimage.png'],
  },
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
