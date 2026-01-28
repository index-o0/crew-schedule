'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useScheduleStore } from '@/store/scheduleStore';
import { Vote } from '@/types';
import { formatDateKorean, generateId } from '@/lib/utils';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { UserProfile } from '@/components/auth/UserProfile';

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params.id as string;
  const { data: session, status } = useSession();

  const { getSchedule, addVote, updateVote, hasVoted, getVoteByEmail, initializeFromLocalStorage } =
    useScheduleStore();

  const [schedule, setSchedule] = useState<ReturnType<typeof getSchedule>>();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
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

  // 로그인 시 기존 투표 확인
  useEffect(() => {
    if (session?.user?.email && schedule) {
      const existingVote = getVoteByEmail(scheduleId, session.user.email);
      if (existingVote) {
        setSelectedTimeSlots(existingVote.timeSlotIds);
        setIsEditMode(true);
      }
    }
  }, [session, schedule, scheduleId, getVoteByEmail]);

  const toggleTimeSlot = (slotId: string) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleSubmit = () => {
    if (!schedule || !session?.user?.email || !session?.user?.name) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (selectedTimeSlots.length === 0) {
      alert('시간대를 최소 1개 이상 선택해주세요.');
      return;
    }

    const vote: Vote = {
      voterId: generateId(),
      voterName: session.user.name,
      voterEmail: session.user.email,
      timeSlotIds: selectedTimeSlots,
      votedAt: new Date().toISOString(),
    };

    if (isEditMode) {
      updateVote(scheduleId, session.user.email, vote);
      alert('투표가 수정되었습니다!');
    } else {
      addVote(scheduleId, vote);
      alert('투표가 완료되었습니다!');
    }

    router.push(`/result/${scheduleId}`);
  };

  if (isLoading || !schedule) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
          <div className="text-sm text-slate-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* 헤더 */}
      <div className="header-gradient pt-8 pb-12 px-4">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs text-indigo-200 mb-1">일정 투표</p>
          <h1 className="text-xl font-bold text-white mb-1">{schedule.title}</h1>
          <p className="text-indigo-100">{formatDateKorean(schedule.date)}</p>
        </div>
      </div>

      <div className="px-4 -mt-6">
        <div className="max-w-lg mx-auto space-y-4">

          {/* 투표 카드 */}
          <div className="card p-5 fade-in">
            {/* 로그인 상태 */}
            {status === 'loading' ? (
              <div className="text-center py-6 text-slate-500 text-sm">
                로그인 상태 확인 중...
              </div>
            ) : session ? (
              <div className="mb-5">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {session.user?.image && (
                      <img
                        src={session.user.image}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium text-slate-800">{session.user?.name}</p>
                      <p className="text-xs text-slate-500">
                        {isEditMode ? '기존 투표를 수정합니다' : '투표하기'}
                      </p>
                    </div>
                  </div>
                  {isEditMode && (
                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                      수정 모드
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-600 font-medium mb-1">투표하려면 로그인하세요</p>
                <p className="text-sm text-slate-500 mb-4">
                  구글 계정으로 간편하게 로그인
                </p>
                <div className="flex justify-center">
                  <GoogleSignInButton />
                </div>
              </div>
            )}

            {/* 시간 선택 (로그인된 경우만) */}
            {session && (
              <>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    가능한 시간 선택 <span className="font-normal text-slate-400">(복수 선택)</span>
                  </label>
                  <div className="space-y-2">
                    {schedule.timeSlots.map((slot) => {
                      const isSelected = selectedTimeSlots.includes(slot.id);
                      return (
                        <button
                          key={slot.id}
                          onClick={() => toggleTimeSlot(slot.id)}
                          className={`w-full px-4 py-3.5 rounded-xl font-medium text-left flex items-center justify-between transition ${
                            isSelected
                              ? 'chip-selected'
                              : 'chip'
                          }`}
                        >
                          <span>{slot.label}</span>
                          {isSelected && (
                            <span className="text-white">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 제출 버튼 */}
                <button
                  onClick={handleSubmit}
                  disabled={selectedTimeSlots.length === 0}
                  className="w-full py-4 btn-primary rounded-xl font-semibold text-lg"
                >
                  {isEditMode ? '투표 수정하기' : '투표하기'}
                </button>
              </>
            )}
          </div>

          {/* 결과 보기 */}
          <button
            onClick={() => router.push(`/result/${scheduleId}`)}
            className="w-full py-3 btn-secondary rounded-xl font-medium text-sm"
          >
            현재 결과 보기 →
          </button>

          {/* 링크 공유 */}
          <div className="card p-4 fade-in">
            <p className="text-sm font-medium text-slate-700 mb-2">링크 공유</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={typeof window !== 'undefined' ? window.location.href : ''}
                readOnly
                className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('링크가 복사되었습니다!');
                }}
                className="px-4 py-2.5 btn-primary rounded-lg font-medium text-sm"
              >
                복사
              </button>
            </div>
          </div>

          {/* 메인으로 */}
          <div className="text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-slate-500 hover:text-slate-700 transition"
            >
              ← 메인으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
