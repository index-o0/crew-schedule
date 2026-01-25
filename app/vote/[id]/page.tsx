'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useScheduleStore } from '@/store/scheduleStore';
import { Vote, Member } from '@/types';
import { formatDateKorean, generateId } from '@/lib/utils';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { UserProfile } from '@/components/auth/UserProfile';

export default function VotePage() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params.id as string;
  const { data: session, status } = useSession();

  const { getSchedule, addVote, updateVote, hasVoted, initializeFromLocalStorage } =
    useScheduleStore();

  const [schedule, setSchedule] = useState<ReturnType<typeof getSchedule>>();
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showManualSelect, setShowManualSelect] = useState(false);

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

  // 구글 로그인 시 자동으로 멤버 매칭 또는 생성
  useEffect(() => {
    if (session?.user?.name && schedule) {
      const userName = session.user.name;

      // 멤버 리스트에서 같은 이름 찾기
      let member = schedule.members.find((m) => m.name === userName);

      // 없으면 새로 추가
      if (!member) {
        member = { id: generateId(), name: userName };
        // 스토어에 멤버 추가 로직은 스토어에 추가 필요
      }

      setSelectedMemberId(member.id);
      loadExistingVote(member.id);
    }
  }, [session, schedule]);

  const toggleTimeSlot = (slotId: string) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleSubmit = () => {
    if (!schedule) return;

    if (!selectedMemberId) {
      alert('멤버를 선택해주세요.');
      return;
    }

    if (selectedTimeSlots.length === 0) {
      alert('시간대를 최소 1개 이상 선택해주세요.');
      return;
    }

    // 멤버 이름 가져오기 (구글 로그인 사용자 또는 선택한 멤버)
    let memberName = session?.user?.name || '';
    const selectedMember = schedule.members.find((m) => m.id === selectedMemberId);
    if (selectedMember) {
      memberName = selectedMember.name;
    }

    // 이미 투표했는지 확인
    const alreadyVoted = hasVoted(scheduleId, selectedMemberId);

    if (alreadyVoted && !isEditMode) {
      alert('이미 투표하셨습니다. 수정하시려면 수정 모드를 활성화하세요.');
      return;
    }

    const vote: Vote = {
      memberId: selectedMemberId,
      memberName: memberName,
      timeSlotIds: selectedTimeSlots,
      votedAt: new Date().toISOString(),
    };

    if (isEditMode) {
      updateVote(scheduleId, selectedMemberId, vote);
      alert('투표가 수정되었습니다!');
    } else {
      addVote(scheduleId, vote);
      alert('투표가 완료되었습니다!');
    }

    router.push(`/result/${scheduleId}`);
  };

  const loadExistingVote = (memberId: string) => {
    if (!schedule) return;

    const existingVote = schedule.votes.find((v) => v.memberId === memberId);
    if (existingVote) {
      setSelectedTimeSlots(existingVote.timeSlotIds);
      setIsEditMode(true);
    } else {
      setSelectedTimeSlots([]);
      setIsEditMode(false);
    }
  };

  if (isLoading || !schedule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    );
  }

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
        </div>

        {/* 투표 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* 구글 로그인 섹션 */}
          {status === 'loading' ? (
            <div className="text-center py-4 text-gray-600">
              로그인 상태 확인 중...
            </div>
          ) : session ? (
            <div className="space-y-3">
              <UserProfile session={session} />
              <p className="text-sm text-green-600 text-center">
                로그인된 이름으로 자동 투표됩니다: <strong>{session.user?.name}</strong>
              </p>
              {!showManualSelect && (
                <button
                  onClick={() => setShowManualSelect(true)}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  다른 멤버로 투표하기
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  구글 계정으로 로그인하면 자동으로 이름이 입력됩니다
                </p>
                <div className="flex justify-center">
                  <GoogleSignInButton />
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>
              <button
                onClick={() => setShowManualSelect(true)}
                className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
              >
                멤버 리스트에서 직접 선택하기
              </button>
            </div>
          )}

          {/* 멤버 선택 (수동 선택 또는 로그인 안 한 경우) */}
          {(showManualSelect || !session) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                누구신가요?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {schedule.members.map((member) => {
                  const voted = hasVoted(scheduleId, member.id);
                  return (
                    <button
                      key={member.id}
                      onClick={() => {
                        setSelectedMemberId(member.id);
                        loadExistingVote(member.id);
                      }}
                      className={`px-4 py-3 rounded-lg font-medium transition ${
                        selectedMemberId === member.id
                          ? 'bg-purple-500 text-white'
                          : voted
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {member.name}
                      {voted && ' ✓'}
                    </button>
                  );
                })}
              </div>
              {isEditMode && (
                <p className="text-sm text-orange-600 mt-2">
                  수정 모드: 기존 투표를 수정할 수 있습니다
                </p>
              )}
            </div>
          )}

          {/* 시간 선택 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              가능한 시간을 선택해주세요 (복수 선택 가능)
            </label>
            <div className="space-y-2">
              {schedule.timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => toggleTimeSlot(slot.id)}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition text-left ${
                    selectedTimeSlots.includes(slot.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {slot.label}
                  {selectedTimeSlots.includes(slot.id) && ' ✓'}
                </button>
              ))}
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={!selectedMemberId || selectedTimeSlots.length === 0}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditMode ? '투표 수정하기' : '투표하기'}
          </button>

          {/* 결과 보기 버튼 */}
          <button
            onClick={() => router.push(`/result/${scheduleId}`)}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
          >
            현재 결과 보기
          </button>
        </div>

        {/* 링크 공유 섹션 */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            링크 공유하기
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={typeof window !== 'undefined' ? window.location.href : ''}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
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
