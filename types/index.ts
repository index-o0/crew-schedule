export interface TimeSlot {
  id: string;
  label: string; // 예: "오후 2시", "저녁 7시"
}

export interface Member {
  id: string;
  name: string;
}

export interface Vote {
  memberId: string;
  memberName: string;
  timeSlotIds: string[];
  votedAt: string;
}

export interface Schedule {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD 형식
  timeSlots: TimeSlot[];
  members: Member[];
  votes: Vote[];
  createdAt: string;
}

export interface ScheduleFormData {
  title: string;
  date: string;
  timeSlots: TimeSlot[];
  members: Member[];
}
