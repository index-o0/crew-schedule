'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TimeSlot, Member, Schedule } from '@/types';
import { generateId, formatDate, formatDateKorean } from '@/lib/utils';
import { useScheduleStore } from '@/store/scheduleStore';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { UserProfile } from '@/components/auth/UserProfile';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addSchedule, getMySchedules, initializeFromLocalStorage } = useScheduleStore();

  const [mySchedules, setMySchedules] = useState<Schedule[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 일정 생성 폼 상태
  const [title, setTitle] = useState('걸뱅이크루 모임');
  const [date, setDate] = useState(formatDate(new Date()));
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: generateId(), label: '오전 10시' },
    { id: generateId(), label: '오후 2시' },
    { id: generateId(), label: '오후 6시' },
  ]);
  const [members, setMembers] = useState<Member[]>([
    { id: generateId(), name: '멤버1' },
    { id: generateId(), name: '멤버2' },
    { id: generateId(), name: '멤버3' },
  ]);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [newMember, setNewMember] = useState('');

  useEffect(() => {
    initializeFromLocalStorage();
    setIsLoading(false);
  }, [initializeFromLocalStorage]);

  useEffect(() => {
    if (!isLoading && session?.user?.email) {
      const schedules = getMySchedules(session.user.email);
      setMySchedules(schedules);
    }
  }, [isLoading, session, getMySchedules]);

  const addTimeSlot = () => {
    if (newTimeSlot.trim()) {
      setTimeSlots([...timeSlots, { id: generateId(), label: newTimeSlot.trim() }]);
      setNewTimeSlot('');
    }
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
  };

  const addMemberItem = () => {
    if (newMember.trim()) {
      setMembers([...members, { id: generateId(), name: newMember.trim() }]);
      setNewMember('');
    }
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const createSchedule = () => {
    if (timeSlots.length === 0) {
      alert('시간대를 최소 1개 이상 추가해주세요.');
      return;
    }
    if (members.length === 0) {
      alert('멤버를 최소 1명 이상 추가해주세요.');
      return;
    }

    const schedule: Schedule = {
      id: generateId(),
      title,
      date,
      timeSlots,
      members,
      votes: [],
      createdAt: new Date().toISOString(),
      createdBy: session?.user?.email || undefined,
    };

    addSchedule(schedule);
    router.push(`/vote/${schedule.id}`);
  };

  // 로딩 중
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    );
  }

  // 로그인 안 됨
  if (!session) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              걸뱅이크루 일정 관리
            </h1>
            <p className="text-gray-600">
              모임 일정을 만들고 멤버들과 공유하세요
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
            <div className="text-6xl">📅</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                로그인이 필요합니다
              </h2>
              <p className="text-gray-600 text-sm">
                일정을 만들고 관리하려면 구글 계정으로 로그인하세요
              </p>
            </div>
            <div className="flex justify-center">
              <GoogleSignInButton />
            </div>
            <p className="text-xs text-gray-500">
              카카오톡에서 공유받은 링크가 있다면<br />
              그 링크로 바로 투표할 수 있습니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 로그인 됨 - 대시보드
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            걸뱅이크루 일정 관리
          </h1>
        </div>

        {/* 사용자 프로필 */}
        <div className="mb-6">
          <UserProfile session={session} />
        </div>

        {/* 내 일정 목록 */}
        {!showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">내 일정</h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 font-medium text-sm transition-all"
              >
                + 새 일정 만들기
              </button>
            </div>

            {mySchedules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📭</div>
                <p>아직 만든 일정이 없습니다</p>
                <p className="text-sm">새 일정을 만들어보세요!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mySchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition cursor-pointer"
                    onClick={() => router.push(`/result/${schedule.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{schedule.title}</h3>
                        <p className="text-sm text-gray-600">
                          {formatDateKorean(schedule.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-blue-600 font-medium">
                          {schedule.votes.length}명 참여
                        </span>
                        <p className="text-xs text-gray-500">
                          {schedule.members.length}명 중
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = `${window.location.origin}/vote/${schedule.id}`;
                          navigator.clipboard.writeText(url);
                          alert('링크가 복사되었습니다!');
                        }}
                        className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                      >
                        링크 복사
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/vote/${schedule.id}`);
                        }}
                        className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
                      >
                        투표 페이지
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 일정 생성 폼 */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">새 일정 만들기</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                모임 제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="모임 제목을 입력하세요"
              />
            </div>

            {/* 날짜 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                날짜
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* 시간대 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                가능한 시간대
              </label>
              <div className="space-y-2 mb-3">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded-lg"
                  >
                    <span className="text-gray-800">{slot.label}</span>
                    <button
                      onClick={() => removeTimeSlot(slot.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTimeSlot()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="예: 오후 3시"
                />
                <button
                  onClick={addTimeSlot}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition"
                >
                  추가
                </button>
              </div>
            </div>

            {/* 멤버 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                멤버 목록
              </label>
              <div className="space-y-2 mb-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between bg-purple-50 px-4 py-2 rounded-lg"
                  >
                    <span className="text-gray-800">{member.name}</span>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMemberItem()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="멤버 이름"
                />
                <button
                  onClick={addMemberItem}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium transition"
                >
                  추가
                </button>
              </div>
            </div>

            {/* 생성 버튼 */}
            <button
              onClick={createSchedule}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              일정 만들기
            </button>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>일정을 만들면 링크가 생성되어 카카오톡으로 공유할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}
