'use client';

import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';

interface UserProfileProps {
  session: Session;
}

export function UserProfile({ session }: UserProfileProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
      {session.user?.image && (
        <img
          src={session.user.image}
          alt={session.user.name || '사용자'}
          className="w-10 h-10 rounded-full"
        />
      )}
      <div className="flex-1">
        <p className="font-medium text-gray-900">{session.user?.name}</p>
        <p className="text-sm text-gray-500">{session.user?.email}</p>
      </div>
      <button
        onClick={() => signOut()}
        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition"
      >
        로그아웃
      </button>
    </div>
  );
}
