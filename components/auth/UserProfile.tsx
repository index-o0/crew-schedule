'use client';

import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';

interface UserProfileProps {
  session: Session;
  compact?: boolean;
}

export function UserProfile({ session, compact = false }: UserProfileProps) {
  if (compact) {
    return (
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition"
      >
        {session.user?.image && (
          <img
            src={session.user.image}
            alt=""
            className="w-6 h-6 rounded-full"
          />
        )}
        <span className="text-sm text-white font-medium">{session.user?.name?.split(' ')[0]}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
      {session.user?.image && (
        <img
          src={session.user.image}
          alt={session.user.name || '사용자'}
          className="w-10 h-10 rounded-full"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 truncate">{session.user?.name}</p>
        <p className="text-sm text-slate-500 truncate">{session.user?.email}</p>
      </div>
      <button
        onClick={() => signOut()}
        className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
      >
        로그아웃
      </button>
    </div>
  );
}
