"use client";

import { useState, type ReactNode } from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardTopBar } from "@/components/layout/DashboardTopBar";

type Props = {
  children: ReactNode;
  name: string;
  roles: string[];
  publicUrl: string;
  publicHref: string;
};

export function DashboardShell({
  children,
  name,
  roles,
  publicUrl,
  publicHref,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        publicHref={publicHref}
        open={open}
        onClose={() => setOpen(false)}
      />
      <div className="md:pl-[64px] lg:pl-[72px]">
        <div className="mx-auto w-full max-w-[1400px] px-3 py-3 sm:px-5 sm:py-4 lg:px-7 lg:py-5">
          <DashboardTopBar
            name={name}
            roles={roles}
            publicUrl={publicUrl}
            onMenu={() => setOpen(true)}
          />
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
