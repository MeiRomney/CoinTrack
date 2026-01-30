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
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
