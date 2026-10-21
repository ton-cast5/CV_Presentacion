import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "slate";

const styles: Record<Variant, string> = {
  primary:
    "bg-primary-container text-white hover:bg-primary shadow-sm hover:shadow-md",
  slate: "bg-slate text-white hover:bg-[#1e293b] shadow-sm",
  secondary:
    "bg-white text-on-surface border border-outline-variant hover:bg-surface-low hover:border-[#cbd5e1]",
  ghost: "bg-transparent text-muted hover:bg-surface-low hover:text-on-surface",
  danger: "bg-error text-white hover:bg-[#93000a]",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  icon?: string;
};

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  icon,
  ...rest
}: Props) {
  const cls = `inline-flex h-10 items-center justify-center gap-2 rounded px-4 text-[13px] font-semibold tracking-[0.01em] transition-all duration-150 disabled:opacity-50 ${styles[variant]} ${className}`;
  const content = (
    <>
      {icon ? <span className="material-symbols-outlined text-[18px]">{icon}</span> : null}
      {children}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {content}
    </button>
  );
}
