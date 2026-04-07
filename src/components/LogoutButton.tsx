'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import toast from 'react-hot-toast';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success('Logged out successfully');
      router.push('/login');
    } else {
      toast.error(result.error || 'Logout failed');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors w-full"
    >
      <LogOut className="h-5 w-5" />
      <span>Logout</span>
    </button>
  );
}