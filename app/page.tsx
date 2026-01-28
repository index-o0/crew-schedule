'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TimeSlot, Schedule } from '@/types';
import { generateId, formatDate, formatDateKorean } from '@/lib/utils';
import { useScheduleStore } from '@/store/scheduleStore';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { UserProfile } from '@/components/auth/UserProfile';

// 시간 옵션
const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // 시간 선택 상태
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('PM');
  const [selectedHour, setSelectedHour] = useState<number>(2);

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

  const formatTimeLabel = (period: 'AM' | 'PM', hour: number) => {
    const periodKo = period === 'AM' ? '오전' : '오후';
    return `${periodKo} ${hour}시`;
  };

  const addTimeSlot = () => {
    const label = formatTimeLabel(selectedPeriod, selectedHour);

    // 중복 체크
    if (timeSlots.some(slot => slot.label === label)) {
      alert('이미 추가된 시간입니다.');
      return;
    }

    setTimeSlots([...timeSlots, { id: generateId(), label }]);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
  };

  const createSchedule = () => {
    if (timeSlots.length === 0) {
      alert('시간대를 최소 1개 이상 추가해주세요.');
      return;
    }

    const schedule: Schedule = {
      id: generateId(),
      title,
      date,
      timeSlots,
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
          <div className="text-sm text-slate-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  // 로그인 안 됨
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* 헤더 */}
        <div className="header-gradient pt-12 pb-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="text-4xl mb-3">📅</div>
            <h1 className="text-2xl font-bold text-white mb-1">걸뱅이크루</h1>
            <p className="text-indigo-100">일정 관리</p>
          </div>
        </div>

        {/* 로그인 카드 */}
        <div className="px-4 -mt-8">
          <div className="max-w-md mx-auto card p-6 text-center fade-in">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              로그인이 필요합니다
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              일정을 만들고 투표하려면<br />구글 계정으로 로그인하세요
            </p>
            <div className="flex justify-center">
              <GoogleSignInButton />
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                카카오톡에서 공유받은 링크가 있다면<br />
                그 링크로 바로 투표할 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 로그인 됨 - 대시보드
  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* 헤더 */}
      <div className="header-gradient pt-8 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">걸뱅이크루</h1>
              <p className="text-sm text-indigo-100">일정 관리</p>
            </div>
            <UserProfile session={session} compact />
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6">
        <div className="max-w-lg mx-auto space-y-4">

          {/* 내 일정 목록 */}
          {!showCreateForm && (
            <div className="card p-5 fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-800">내 일정</h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 btn-primary rounded-lg text-sm font-medium"
                >
                  + 새 일정
                </button>
              </div>

              {mySchedules.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">📭</div>
                  <p className="text-sm text-slate-500">아직 만든 일정이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition"
                      onClick={() => router.push(`/result/${schedule.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-slate-800">{schedule.title}</h3>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {formatDateKorean(schedule.date)}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                          {schedule.votes.length}명 참여
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = `${window.location.origin}/vote/${schedule.id}`;
                            navigator.clipboard.writeText(url);
                            alert('링크가 복사되었습니다!');
                          }}
                          className="text-xs px-3 py-1.5 bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 transition font-medium"
                        >
                          🔗 링크 복사
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
            <div className="card p-5 fade-in">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-slate-800">새 일정 만들기</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  ✕
                </button>
              </div>

              {/* 제목 */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  모임 제목
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-slate-800"
                  placeholder="모임 제목을 입력하세요"
                />
              </div>

              {/* 날짜 */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  날짜
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-slate-800"
                />
              </div>

              {/* 시간대 선택 */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  시간대 추가
                </label>

                {/* AM/PM 선택 */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setSelectedPeriod('AM')}
                    className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition ${
                      selectedPeriod === 'AM' ? 'time-btn-selected' : 'time-btn'
                    }`}
                  >
                    오전
                  </button>
                  <button
                    onClick={() => setSelectedPeriod('PM')}
                    className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition ${
                      selectedPeriod === 'PM' ? 'time-btn-selected' : 'time-btn'
                    }`}
                  >
                    오후
                  </button>
                </div>

                {/* 시간 선택 */}
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {HOURS.map((hour) => (
                    <button
                      key={hour}
                      onClick={() => setSelectedHour(hour)}
                      className={`py-2 rounded-lg font-medium text-sm transition ${
                        selectedHour === hour ? 'time-btn-selected' : 'time-btn'
                      }`}
                    >
                      {hour}시
                    </button>
                  ))}
                </div>

                {/* 선택된 시간 미리보기 & 추가 버튼 */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-slate-600 font-medium">
                    {formatTimeLabel(selectedPeriod, selectedHour)}
                  </div>
                  <button
                    onClick={addTimeSlot}
                    className="px-5 py-3 btn-primary rounded-xl font-medium"
                  >
                    추가
                  </button>
                </div>

                {/* 추가된 시간대 목록 */}
                {timeSlots.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-slate-500 mb-2">추가된 시간대</p>
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between bg-indigo-50 px-4 py-3 rounded-xl"
                      >
                        <span className="text-indigo-700 font-medium">{slot.label}</span>
                        <button
                          onClick={() => removeTimeSlot(slot.id)}
                          className="text-indigo-400 hover:text-indigo-600 transition text-sm"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 생성 버튼 */}
              <button
                onClick={createSchedule}
                disabled={timeSlots.length === 0}
                className="w-full py-4 btn-primary rounded-xl font-semibold text-lg"
              >
                일정 만들기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
