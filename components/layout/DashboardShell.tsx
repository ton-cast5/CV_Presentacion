"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        publicHref={publicHref}
        open={open}
        onClose={() => setOpen(false)}
      />
      <div className="md:pl-[68px] lg:pl-[76px]">
        <div className="mx-auto w-full max-w-[1400px] px-3 py-3 sm:px-5 sm:py-4 lg:px-7 lg:py-5">
          <DashboardTopBar
            name={name}
            roles={roles}
            publicUrl={publicUrl}
            onMenu={() => setOpen(true)}
          />
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              className="min-w-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
