import { ReactNode } from 'react';

export default function CompareLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  );
}
