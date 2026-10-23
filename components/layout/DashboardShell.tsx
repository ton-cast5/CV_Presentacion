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
  docCount: number;
  storageMb: number;
};

export function DashboardShell({
  children,
  name,
  roles,
  publicUrl,
  publicHref,
  docCount,
  storageMb,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        docCount={docCount}
        storageMb={storageMb}
        publicHref={publicHref}
        open={open}
        onClose={() => setOpen(false)}
      />
      <div className="md:pl-[100px]">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <DashboardTopBar
            name={name}
            roles={roles}
            publicUrl={publicUrl}
            onMenu={() => setOpen(true)}
          />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
