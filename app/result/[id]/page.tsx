'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useScheduleStore } from '@/store/scheduleStore';
import { formatDateKorean } from '@/lib/utils';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params.id as string;

  const { getSchedule, initializeFromLocalStorage } = useScheduleStore();
  const [schedule, setSchedule] = useState<ReturnType<typeof getSchedule>>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeFromLocalStorage();
    setIsLoading(false);
  }, [initializeFromLocalStorage]);

  useEffect(() => {
    if (!isLoading) {
      const currentSchedule = getSchedule(scheduleId);
      setSchedule(currentSchedule);

      if (!currentSchedule) {
        alert('일정을 찾을 수 없습니다.');
        router.push('/');
      }
    }
  }, [scheduleId, isLoading, getSchedule, router]);

  if (isLoading || !schedule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    );
  }

  // 시간대별 투표 수 계산
  const timeSlotVotes = schedule.timeSlots.map((slot) => {
    const votes = schedule.votes.filter((vote) =>
      vote.timeSlotIds.includes(slot.id)
    );
    return {
      slot,
      votes,
      count: votes.length,
    };
  });

  // 가장 많은 투표를 받은 시간대
  const maxVotes = Math.max(...timeSlotVotes.map((tv) => tv.count), 0);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {schedule.title}
          </h1>
          <p className="text-lg text-gray-600">
            {formatDateKorean(schedule.date)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            총 {schedule.votes.length}명 참여
          </p>
        </div>

        {/* 결과 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* 시간대별 결과 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              시간대별 참여 현황
            </h2>
            <div className="space-y-3">
              {timeSlotVotes.map(({ slot, votes, count }) => {
                const percentage = schedule.votes.length > 0
                  ? (count / schedule.votes.length) * 100
                  : 0;
                const isTopChoice = count === maxVotes && count > 0;

                return (
                  <div key={slot.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">
                          {slot.label}
                        </span>
                        {isTopChoice && count > 0 && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                            최다 선택
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {count}명
                      </span>
                    </div>

                    {/* 프로그레스 바 */}
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isTopChoice ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* 참여자 리스트 */}
                    {votes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {votes.map((vote) => (
                          <span
                            key={vote.memberId}
                            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                          >
                            {vote.memberName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 멤버별 참여 현황 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              멤버별 참여 현황
            </h2>
            <div className="grid gap-3">
              {schedule.members.map((member) => {
                const vote = schedule.votes.find((v) => v.memberId === member.id);
                return (
                  <div
                    key={member.id}
                    className={`p-4 rounded-lg ${
                      vote ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">
                        {member.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          vote
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {vote ? '투표 완료' : '미참여'}
                      </span>
                    </div>
                    {vote && (
                      <div className="flex flex-wrap gap-1">
                        {vote.timeSlotIds.map((slotId) => {
                          const slot = schedule.timeSlots.find(
                            (s) => s.id === slotId
                          );
                          return slot ? (
                            <span
                              key={slotId}
                              className="text-xs bg-white text-gray-700 px-2 py-1 rounded border border-gray-200"
                            >
                              {slot.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="space-y-2 pt-4">
            <button
              onClick={() => router.push(`/vote/${scheduleId}`)}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 font-bold transition-all"
            >
              투표하기 / 수정하기
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              새 일정 만들기
            </button>
          </div>
        </div>

        {/* 링크 공유 섹션 */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            링크 공유하기
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={
                typeof window !== 'undefined'
                  ? window.location.origin + `/vote/${scheduleId}`
                  : ''
              }
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={() => {
                const url = window.location.origin + `/vote/${scheduleId}`;
                navigator.clipboard.writeText(url);
                alert('링크가 복사되었습니다!');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition"
            >
              복사
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
