"use client";

import * as Headless from "@headlessui/react";
import React, { useState } from "react";
import { NavbarItem } from "./navbar";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

function MobileSidebar({
  open,
  close,
  children,
}: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
  return (
    <Headless.Dialog open={open} onClose={close} className="lg:hidden">
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <Headless.DialogPanel
        transition
        className="fixed inset-y-0 w-full max-w-80 p-2 transition duration-300 ease-in-out data-closed:-translate-x-full"
      >
        <div className="flex h-full flex-col rounded-lg bg-card shadow-xs ring-1 ring-border">
          <div className="-mb-3 px-4 pt-3">
            <Headless.CloseButton
              as={NavbarItem}
              aria-label="Close navigation"
              className="[&>button]:cursor-pointer"
            >
              <XMarkIcon />
            </Headless.CloseButton>
          </div>
          {children}
        </div>
      </Headless.DialogPanel>
    </Headless.Dialog>
  );
}

export function StandardLayout({
  navbar,
  sidebar,
  children,
}: React.PropsWithChildren<{
  navbar: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="relative isolate flex h-svh overflow-hidden w-full bg-background flex-col lg:bg-muted">
      {/* Sidebar on mobile */}
      <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
        {sidebar}
      </MobileSidebar>

      {/* Navbar */}
      <header className="flex items-center px-4 bg-primary dark:bg-primary-900">
        <div className="py-2.5 lg:hidden">
          <NavbarItem
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation"
            className="[&>button]:cursor-pointer"
          >
            <Bars3Icon className="!fill-current !stroke-current text-white dark:text-white" />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>
      </header>

      <div className="flex flex-row relative flex-1 overflow-auto">
        {/* Sidebar on desktop */}
        <div className="w-64 max-lg:hidden">{sidebar}</div>
        {/* Content */}
        <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-2 lg:px-2 overflow-auto">
          <div className="grow p-6 lg:rounded-lg lg:bg-card lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-border">
            <div className="mx-auto max-w-6xl">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
