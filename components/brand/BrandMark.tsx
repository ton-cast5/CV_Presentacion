type Props = {
  size?: number;
  className?: string;
  title?: string;
};

/** FolioCraft mark from public SVG */
export function BrandMark({
  size = 32,
  className = "",
  title = "FolioCraft",
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
    />
  );
}
