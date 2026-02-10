"use client";

import React from "react";

export function StandardLayout({
  navbar,
  children,
}: React.PropsWithChildren<{
  navbar: React.ReactNode;
}>) {
  return (
    <div className="relative isolate flex min-h-screen w-full flex-col bg-white dark:bg-black">
      {/* Navbar - it handles its own mobile menu */}
      {navbar}

      {/* Content */}
      <main className="flex flex-1 flex-col overflow-x-hidden">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
