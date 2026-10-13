import { FRAMES, PALETTE, SPRITE_H, SPRITE_W, type FrameName } from "./mascot-sprite";

/** One mascot frame as crisp SVG rects; size it with className (width), height follows. */
export function Sprite({ frame, className }: { frame: FrameName; className?: string }) {
  const rows = FRAMES[frame];
  return (
    <svg
      viewBox={`0 0 ${SPRITE_W} ${SPRITE_H}`}
      shapeRendering="crispEdges"
      className={`block h-auto ${className ?? ""}`}
      aria-hidden
    >
      {rows.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={PALETTE[c]} />,
        ),
      )}
    </svg>
  );
}
