import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '일정 투표 | 걸뱅이크루 일정 관리',
  description: '걸뱅이크루 모임 일정에 투표하세요',
  openGraph: {
    title: '걸뱅이크루 일정 관리',
    description: '모임 일정에 투표하세요',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function VoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
