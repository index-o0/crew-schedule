'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Schedule } from '@/types';
import { formatDateKorean } from '@/lib/utils';
import * as api from '@/lib/scheduleApi';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params.id as string;

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleNotFound, setScheduleNotFound] = useState(false);

  useEffect(() => {
    async function loadSchedule() {
      const data = await api.getSchedule(scheduleId);

      if (!data) {
        setScheduleNotFound(true);
        setIsLoading(false);
        return;
      }

      setSchedule(data);
      setIsLoading(false);
    }

    loadSchedule();
  }, [scheduleId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
          <div className="text-sm text-slate-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (scheduleNotFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto card p-6 text-center">
          <div className="text-4xl mb-3">😢</div>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            일정을 찾을 수 없습니다
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            삭제되었거나 잘못된 링크입니다
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 btn-primary rounded-xl font-medium"
          >
            메인으로 이동
          </button>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return null;
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

  const maxVotes = Math.max(...timeSlotVotes.map((tv) => tv.count), 0);
  const totalVoters = schedule.votes.length;

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* 헤더 */}
      <div className="header-gradient pt-8 pb-12 px-4">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs text-indigo-200 mb-1">투표 결과</p>
          <h1 className="text-xl font-bold text-white mb-1">{schedule.title}</h1>
          <p className="text-indigo-100">{formatDateKorean(schedule.date)}</p>

          {/* 참여 현황 */}
          <div className="mt-4 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2">
            <span className="text-white font-semibold">{totalVoters}명</span>
            <span className="text-indigo-200">참여</span>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6">
        <div className="max-w-lg mx-auto space-y-4">

          {/* 시간대별 결과 */}
          <div className="card p-5 fade-in">
            <h2 className="font-semibold text-slate-800 mb-4">시간대별 현황</h2>

            {timeSlotVotes.length === 0 ? (
              <p className="text-center text-slate-500 py-6">시간대가 없습니다</p>
            ) : (
              <div className="space-y-4">
                {timeSlotVotes.map(({ slot, votes, count }) => {
                  const percentage = totalVoters > 0 ? (count / totalVoters) * 100 : 0;
                  const isTopChoice = count === maxVotes && count > 0;

                  return (
                    <div key={slot.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{slot.label}</span>
                          {isTopChoice && (
                            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                              최다
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-indigo-600">{count}명</span>
                      </div>

                      {/* 프로그레스 바 */}
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isTopChoice ? 'bg-amber-400' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      {/* 참여자 목록 */}
                      {votes.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {votes.map((vote) => (
                            <span
                              key={vote.voterEmail}
                              className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full"
                            >
                              {vote.voterName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 참여자 목록 */}
          <div className="card p-5 fade-in">
            <h2 className="font-semibold text-slate-800 mb-4">참여자 ({totalVoters}명)</h2>

            {totalVoters === 0 ? (
              <p className="text-center text-slate-500 py-6">아직 참여자가 없습니다</p>
            ) : (
              <div className="space-y-3">
                {schedule.votes.map((vote) => (
                  <div
                    key={vote.voterEmail}
                    className="p-3 bg-slate-50 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-800">{vote.voterName}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(vote.votedAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {vote.timeSlotIds.map((slotId) => {
                        const slot = schedule.timeSlots.find((s) => s.id === slotId);
                        return slot ? (
                          <span
                            key={slotId}
                            className="text-xs px-2 py-1 bg-white text-slate-600 rounded border border-slate-200"
                          >
                            {slot.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 버튼들 */}
          <div className="space-y-2">
            <button
              onClick={() => router.push(`/vote/${scheduleId}`)}
              className="w-full py-3.5 btn-primary rounded-xl font-semibold"
            >
              투표하기 / 수정하기
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 btn-secondary rounded-xl font-medium text-sm"
            >
              ← 메인으로
            </button>
          </div>

          {/* 링크 공유 */}
          <div className="card p-4 fade-in">
            <p className="text-sm font-medium text-slate-700 mb-2">투표 링크 공유</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={
                  typeof window !== 'undefined'
                    ? `${window.location.origin}/vote/${scheduleId}`
                    : ''
                }
                readOnly
                className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600"
              />
              <button
                onClick={() => {
                  const url = `${window.location.origin}/vote/${scheduleId}`;
                  navigator.clipboard.writeText(url);
                  alert('링크가 복사되었습니다!');
                }}
                className="px-4 py-2.5 btn-primary rounded-lg font-medium text-sm"
              >
                복사
              </button>
            </div>
          </div>

          {/* 푸터 */}
          <div className="text-center pt-4">
            <p className="text-xs text-slate-300">© 수현쨩</p>
          </div>
        </div>
      </div>
    </div>
  );
}
