import { supabase, DbSchedule, DbVote } from './supabase';
import { Schedule, Vote, TimeSlot } from '@/types';

// Schedule을 DB 형식으로 변환
function toDbSchedule(schedule: Schedule): Omit<DbSchedule, 'created_at'> {
  return {
    id: schedule.id,
    title: schedule.title,
    date: schedule.date,
    time_slots: schedule.timeSlots,
    created_by: schedule.createdBy || '',
  };
}

// DB 형식을 Schedule로 변환
function fromDbSchedule(db: DbSchedule, votes: Vote[]): Schedule {
  return {
    id: db.id,
    title: db.title,
    date: db.date,
    timeSlots: db.time_slots as TimeSlot[],
    votes: votes,
    createdAt: db.created_at,
    createdBy: db.created_by,
  };
}

// Vote를 DB 형식으로 변환
function toDbVote(scheduleId: string, vote: Vote): Omit<DbVote, 'id'> {
  return {
    schedule_id: scheduleId,
    voter_id: vote.voterId,
    voter_name: vote.voterName,
    voter_email: vote.voterEmail,
    time_slot_ids: vote.timeSlotIds,
    voted_at: vote.votedAt,
  };
}

// DB 형식을 Vote로 변환
function fromDbVote(db: DbVote): Vote {
  return {
    voterId: db.voter_id,
    voterName: db.voter_name,
    voterEmail: db.voter_email,
    timeSlotIds: db.time_slot_ids,
    votedAt: db.voted_at,
  };
}

// 일정 생성
export async function createSchedule(schedule: Schedule): Promise<Schedule | null> {
  const dbSchedule = toDbSchedule(schedule);

  const { data, error } = await supabase
    .from('schedules')
    .insert(dbSchedule)
    .select()
    .single();

  if (error) {
    console.error('Error creating schedule:', error);
    return null;
  }

  return fromDbSchedule(data, []);
}

// 일정 조회
export async function getSchedule(id: string): Promise<Schedule | null> {
  const { data: scheduleData, error: scheduleError } = await supabase
    .from('schedules')
    .select('*')
    .eq('id', id)
    .single();

  if (scheduleError || !scheduleData) {
    console.error('Error fetching schedule:', scheduleError);
    return null;
  }

  const { data: votesData, error: votesError } = await supabase
    .from('votes')
    .select('*')
    .eq('schedule_id', id);

  if (votesError) {
    console.error('Error fetching votes:', votesError);
    return null;
  }

  const votes = (votesData || []).map(fromDbVote);
  return fromDbSchedule(scheduleData, votes);
}

// 내 일정 목록 조회
export async function getMySchedules(email: string): Promise<Schedule[]> {
  const { data: schedulesData, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('created_by', email)
    .order('created_at', { ascending: false });

  if (error || !schedulesData) {
    console.error('Error fetching my schedules:', error);
    return [];
  }

  // 각 일정의 투표 수 조회
  const schedules = await Promise.all(
    schedulesData.map(async (s) => {
      const { data: votesData } = await supabase
        .from('votes')
        .select('*')
        .eq('schedule_id', s.id);

      const votes = (votesData || []).map(fromDbVote);
      return fromDbSchedule(s, votes);
    })
  );

  return schedules;
}

// 일정 삭제
export async function deleteSchedule(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting schedule:', error);
    return false;
  }

  return true;
}

// 투표 추가
export async function addVote(scheduleId: string, vote: Vote): Promise<boolean> {
  const dbVote = toDbVote(scheduleId, vote);

  const { error } = await supabase
    .from('votes')
    .insert(dbVote);

  if (error) {
    console.error('Error adding vote:', error);
    return false;
  }

  return true;
}

// 투표 수정
export async function updateVote(scheduleId: string, voterEmail: string, vote: Vote): Promise<boolean> {
  const { error } = await supabase
    .from('votes')
    .update({
      time_slot_ids: vote.timeSlotIds,
      voted_at: vote.votedAt,
    })
    .eq('schedule_id', scheduleId)
    .eq('voter_email', voterEmail);

  if (error) {
    console.error('Error updating vote:', error);
    return false;
  }

  return true;
}

// 이메일로 투표 조회
export async function getVoteByEmail(scheduleId: string, voterEmail: string): Promise<Vote | null> {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('schedule_id', scheduleId)
    .eq('voter_email', voterEmail)
    .single();

  if (error || !data) {
    return null;
  }

  return fromDbVote(data);
}
