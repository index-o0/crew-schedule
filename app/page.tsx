'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TimeSlot, Member, Schedule } from '@/types';
import { generateId, formatDate } from '@/lib/utils';
import { useScheduleStore } from '@/store/scheduleStore';

export default function Home() {
  const router = useRouter();
  const addSchedule = useScheduleStore((state) => state.addSchedule);

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

  const addTimeSlot = () => {
    if (newTimeSlot.trim()) {
      setTimeSlots([...timeSlots, { id: generateId(), label: newTimeSlot.trim() }]);
      setNewTimeSlot('');
    }
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
  };

  const addMember = () => {
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
    };

    addSchedule(schedule);
    router.push(`/vote/${schedule.id}`);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            걸뱅이크루 일정 관리
          </h1>
          <p className="text-gray-600">
            모임 일정을 만들고 멤버들과 공유하세요
          </p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
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
                onKeyPress={(e) => e.key === 'Enter' && addMember()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="멤버 이름"
              />
              <button
                onClick={addMember}
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

        {/* 안내 메시지 */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>일정을 만들면 링크가 생성되어 카카오톡으로 공유할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}
