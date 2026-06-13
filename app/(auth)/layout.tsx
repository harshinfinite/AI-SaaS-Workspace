import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/50">
      {children}
    </main>
  );
}
