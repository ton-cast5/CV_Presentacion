"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: string;
  rightSlot?: ReactNode;
  hint?: string;
};

/**
 * Icon and text side-by-side (not overlaid).
 * Placeholder vanishes when the user types — normal input behavior.
 */
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
      <div className="fc-auth-field mt-1.5">
        <span className="fc-auth-field__icon" aria-hidden>
          <span className="material-symbols-outlined text-[20px] leading-none">
            {icon}
          </span>
        </span>
        <input {...rest} className={`fc-auth-field__input ${className}`} />
        {rightSlot ? (
          <div className="fc-auth-field__action">{rightSlot}</div>
        ) : null}
      </div>
      {hint ? (
        <p className="mt-1.5 text-[11px] font-normal text-muted">{hint}</p>
      ) : null}
    </label>
  );
}
