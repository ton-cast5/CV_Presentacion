"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: string;
  rightSlot?: ReactNode;
  hint?: string;
};

/** Labeled input with vertically centered Material icon */
export function AuthField({
  label,
  icon,
  rightSlot,
  hint,
  className = "",
  ...rest
}: Props) {
  return (
    <label className="block text-[13px] font-semibold text-on-surface">
      {label}
      <div className="relative mt-1.5">
        <span
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] flex w-11 items-center justify-center text-muted"
          aria-hidden
        >
          <span className="material-symbols-outlined text-[20px] leading-none">
            {icon}
          </span>
        </span>
        <input
          {...rest}
          className={`fc-input ${rightSlot ? "pr-11" : ""} pl-11 ${className}`}
        />
        {rightSlot ? (
          <div className="absolute inset-y-0 right-0 flex w-11 items-center justify-center">
            {rightSlot}
          </div>
        ) : null}
      </div>
      {hint ? (
        <p className="mt-1.5 text-[11px] font-normal text-muted">{hint}</p>
      ) : null}
    </label>
  );
}
