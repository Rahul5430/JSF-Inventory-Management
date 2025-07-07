'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // For demo purposes, always allow access
    // In production, you would check authentication here
    if (!loading && !user) {
      // This won't happen in demo mode since we always have a dummy user
      router.push('/login');
    }
  }, [user, loading, router]);

  // For demo purposes, always show children
  // In production, you would check authentication and roles here
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Demo mode: always allow access
  return <>{children}</>;
};

export default AuthGuard; 