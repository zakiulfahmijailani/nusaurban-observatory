import React from 'react';

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col">
      {/* Assuming there's a global header outside of this, otherwise we might need one here */}
      <main className="flex-1 w-full h-full">
        {children}
      </main>
    </div>
  );
}
