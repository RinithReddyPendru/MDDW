/**
 * Block-printed vegetal border.
 *
 * Kalamkari cloth is bounded, never bled: a repeating carved motif runs along
 * the edge and tells you where the panel begins. Authored as one tile in an
 * SVG pattern so it stays crisp at any width and costs no image request.
 */
export function BlockBorder({
  flip = false,
  className = "",
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 96 14"
      preserveAspectRatio="none"
      className={className}
      role="presentation"
      aria-hidden="true"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <defs>
        <pattern id="kal-vine" width="24" height="14" patternUnits="userSpaceOnUse">
          {/* the running stem */}
          <path d="M0 11h24" stroke="currentColor" strokeWidth="1" fill="none" />
          {/* carved leaf, alternating side */}
          <path
            d="M4 11c0-3.4 2-5.4 5-5.6-.2 3.4-2 5.4-5 5.6Z"
            fill="currentColor"
            opacity="0.85"
          />
          <path
            d="M12 11c0-2.4 1.5-3.9 3.7-4.1-.2 2.5-1.6 4-3.7 4.1Z"
            fill="currentColor"
            opacity="0.5"
          />
          {/* seed dot */}
          <circle cx="20" cy="7.6" r="1.15" fill="currentColor" opacity="0.8" />
        </pattern>
      </defs>
      <rect width="96" height="14" fill="url(#kal-vine)" />
    </svg>
  );
}
