import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";

type Props = {
  href?: string;
  markSize?: number;
  showTagline?: boolean;
  className?: string;
  compact?: boolean;
};

export function BrandLockup({
  href = "/",
  markSize = 32,
  showTagline = false,
  className = "",
  compact = false,
}: Props) {
  const content = (
    <>
      <span className="flex items-center justify-center text-primary">
        <BrandMark size={markSize} />
      </span>
      {!compact ? (
        <span className="min-w-0 leading-tight">
          <span className="block text-[14px] font-semibold tracking-tight text-on-surface sm:text-[15px]">
            FolioCraft
          </span>
          {showTagline ? (
            <span className="block text-[10px] text-muted">Dossier Engine</span>
          ) : null}
        </span>
      ) : null}
    </>
  );

  const cls = `inline-flex items-center gap-2 ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls} title="FolioCraft">
        {content}
      </Link>
    );
  }

  return <span className={cls}>{content}</span>;
}
