import { code128B } from "@/lib/code128";

/** A scannable Code 128 barcode drawn as SVG bars, with the human-readable line below. */
export function Barcode({ value, className, height = 56 }: { value: string; className?: string; height?: number }) {
  const widths = code128B(value);
  const quiet = 10; // quiet zone, in modules, on each side
  const total = widths.reduce((a, b) => a + b, 0) + quiet * 2;
  let x = quiet;
  const bars: { x: number; w: number }[] = [];
  widths.forEach((w, i) => {
    if (i % 2 === 0) bars.push({ x, w });
    x += w;
  });

  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${total} ${height}`}
        preserveAspectRatio="none"
        className="block h-14 w-full"
        role="img"
        aria-label={`Barcode: ${value}`}
        shapeRendering="crispEdges"
      >
        {bars.map((b, i) => (
          <rect key={i} data-bar x={b.x} y={0} width={b.w} height={height} fill="currentColor" />
        ))}
      </svg>
      <figcaption className="mt-1 text-center font-mono text-[11px] tracking-[0.3em]">{value}</figcaption>
    </figure>
  );
}
