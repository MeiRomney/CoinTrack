import React from "react";
import { StandardLayout } from "../ui";
import { Navbar } from "./top-nav/navbar";
import { Outlet } from "react-router-dom";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <StandardLayout navbar={<Navbar />} sidebar={null}>
      {children || <Outlet />}
    </StandardLayout>
  );
}
