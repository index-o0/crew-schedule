import { create } from 'zustand';
import { Schedule, Vote } from '@/types';

interface ScheduleStore {
  schedules: Record<string, Schedule>;
  addSchedule: (schedule: Schedule) => void;
  getSchedule: (id: string) => Schedule | undefined;
  addVote: (scheduleId: string, vote: Vote) => void;
  updateVote: (scheduleId: string, memberId: string, vote: Vote) => void;
  hasVoted: (scheduleId: string, memberId: string) => boolean;
  initializeFromLocalStorage: () => void;
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedules: {},

  addSchedule: (schedule) => {
    set((state) => {
      const newSchedules = {
        ...state.schedules,
        [schedule.id]: schedule,
      };
      // LocalStorage에 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('schedules', JSON.stringify(newSchedules));
      }
      return { schedules: newSchedules };
    });
  },

  getSchedule: (id) => {
    return get().schedules[id];
  },

  addVote: (scheduleId, vote) => {
    set((state) => {
      const schedule = state.schedules[scheduleId];
      if (!schedule) return state;

      const updatedSchedule = {
        ...schedule,
        votes: [...schedule.votes, vote],
      };

      const newSchedules = {
        ...state.schedules,
        [scheduleId]: updatedSchedule,
      };

      // LocalStorage에 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('schedules', JSON.stringify(newSchedules));
        // 투표 기록 저장
        localStorage.setItem(`voted_${scheduleId}_${vote.memberId}`, 'true');
      }

      return { schedules: newSchedules };
    });
  },

  updateVote: (scheduleId, memberId, vote) => {
    set((state) => {
      const schedule = state.schedules[scheduleId];
      if (!schedule) return state;

      const updatedVotes = schedule.votes.map((v) =>
        v.memberId === memberId ? vote : v
      );

      const updatedSchedule = {
        ...schedule,
        votes: updatedVotes,
      };

      const newSchedules = {
        ...state.schedules,
        [scheduleId]: updatedSchedule,
      };

      // LocalStorage에 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('schedules', JSON.stringify(newSchedules));
      }

      return { schedules: newSchedules };
    });
  },

  hasVoted: (scheduleId, memberId) => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`voted_${scheduleId}_${memberId}`) === 'true';
  },

  initializeFromLocalStorage: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('schedules');
      if (stored) {
        try {
          const schedules = JSON.parse(stored);
          set({ schedules });
        } catch (e) {
          console.error('Failed to parse schedules from localStorage', e);
        }
      }
    }
  },
}));
