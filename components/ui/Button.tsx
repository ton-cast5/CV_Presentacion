import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "slate";

const styles: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-sm",
  slate: "bg-slate text-white hover:bg-[#2c2d2a] shadow-sm",
  secondary:
    "bg-white text-on-surface border border-outline hover:bg-surface-2",
  ghost: "bg-transparent text-muted hover:bg-surface-2 hover:text-on-surface",
  danger: "bg-error text-white hover:bg-[#9a4a4a]",
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
  const cls = `inline-flex h-11 items-center justify-center gap-2 rounded-[12px] px-4 text-[13px] font-semibold transition-all duration-150 disabled:opacity-45 ${styles[variant]} ${className}`;
  const content = (
    <>
      {icon ? (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      ) : null}
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
