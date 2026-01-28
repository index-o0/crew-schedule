export interface TimeSlot {
  id: string;
  label: string; // 예: "오후 2시", "저녁 7시"
}

export interface Member {
  id: string;
  name: string;
}

export interface Vote {
  voterId: string;
  voterName: string;
  voterEmail: string; // Google 로그인 이메일 (중복 투표 방지용)
  timeSlotIds: string[];
  votedAt: string;
}

export interface Schedule {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD 형식
  timeSlots: TimeSlot[];
  votes: Vote[];
  createdAt: string;
  createdBy?: string; // 생성자 이메일
}

export interface ScheduleFormData {
  title: string;
  date: string;
  timeSlots: TimeSlot[];
}
