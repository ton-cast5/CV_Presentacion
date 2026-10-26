type Props = {
  size?: number;
  className?: string;
  title?: string;
  /** Prioritize logo fetch on above-the-fold placements */
  priority?: boolean;
};

/** FolioCraft mark — SVG with white rounded background */
export function BrandMark({
  size = 32,
  className = "",
  title = "FolioCraft",
  priority = false,
}: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/foliocraft-logo.svg"
      alt={title}
      width={size}
      height={size}
      className={`shrink-0 object-contain ${className}`}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
