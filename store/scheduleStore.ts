import { create } from 'zustand';
import { Schedule, Vote } from '@/types';

interface ScheduleStore {
  schedules: Record<string, Schedule>;
  addSchedule: (schedule: Schedule) => void;
  getSchedule: (id: string) => Schedule | undefined;
  getMySchedules: (email: string) => Schedule[];
  deleteSchedule: (id: string) => void;
  addVote: (scheduleId: string, vote: Vote) => void;
  updateVote: (scheduleId: string, voterEmail: string, vote: Vote) => void;
  hasVoted: (scheduleId: string, voterEmail: string) => boolean;
  getVoteByEmail: (scheduleId: string, voterEmail: string) => Vote | undefined;
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('schedules', JSON.stringify(newSchedules));
      }
      return { schedules: newSchedules };
    });
  },

  getSchedule: (id) => {
    return get().schedules[id];
  },

  getMySchedules: (email) => {
    const schedules = get().schedules;
    return Object.values(schedules)
      .filter((s) => s.createdBy === email)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  deleteSchedule: (id) => {
    set((state) => {
      const { [id]: deleted, ...remaining } = state.schedules;
      if (typeof window !== 'undefined') {
        localStorage.setItem('schedules', JSON.stringify(remaining));
      }
      return { schedules: remaining };
    });
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

      if (typeof window !== 'undefined') {
        localStorage.setItem('schedules', JSON.stringify(newSchedules));
      }

      return { schedules: newSchedules };
    });
  },

  updateVote: (scheduleId, voterEmail, vote) => {
    set((state) => {
      const schedule = state.schedules[scheduleId];
      if (!schedule) return state;

      const updatedVotes = schedule.votes.map((v) =>
        v.voterEmail === voterEmail ? vote : v
      );

      const updatedSchedule = {
        ...schedule,
        votes: updatedVotes,
      };

      const newSchedules = {
        ...state.schedules,
        [scheduleId]: updatedSchedule,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('schedules', JSON.stringify(newSchedules));
      }

      return { schedules: newSchedules };
    });
  },

  hasVoted: (scheduleId, voterEmail) => {
    const schedule = get().schedules[scheduleId];
    if (!schedule) return false;
    return schedule.votes.some((v) => v.voterEmail === voterEmail);
  },

  getVoteByEmail: (scheduleId, voterEmail) => {
    const schedule = get().schedules[scheduleId];
    if (!schedule) return undefined;
    return schedule.votes.find((v) => v.voterEmail === voterEmail);
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
