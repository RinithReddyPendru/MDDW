import type { FoodGroupId } from "@/lib/mddw/foodGroups";

/**
 * Kalam-line glyphs for the ten MDD-W food groups.
 *
 * Drawn rather than set in emoji: the counselling panel needs one consistent
 * stroke weight and a line that belongs to the same hand as the borders.
 * The subjects are Andhra foods on purpose - mango, brinjal, fish, a steel
 * tumbler - so an ASHA recognises the group from the drawing, not the label.
 */
const PATHS: Record<FoodGroupId, React.ReactNode> = {
  // wheat/rice ear on a stalk
  grains: (
    <>
      <path d="M12 21V9" />
      <path d="M12 9c0-2.2 1.4-3.6 3.4-4.2C15.4 7 14 8.6 12 9Z" />
      <path d="M12 9C12 6.8 10.6 5.4 8.6 4.8 8.6 7 10 8.6 12 9Z" />
      <path d="M12 14c0-2 1.3-3.3 3.1-3.8C15.1 12.2 13.8 13.5 12 14Z" />
      <path d="M12 14c0-2-1.3-3.3-3.1-3.8C8.9 12.2 10.2 13.5 12 14Z" />
    </>
  ),
  // pod split to show seeds
  pulses: (
    <>
      <path d="M4.5 13.5c2.5-5 8-7.5 15-7-1 6-5 10-10.5 10.5" />
      <circle cx="9" cy="12.8" r="1.05" />
      <circle cx="12.4" cy="11" r="1.05" />
      <circle cx="15.6" cy="9.4" r="1.05" />
    </>
  ),
  // groundnut shell, pinched at the waist
  nuts: (
    <>
      <path d="M9.2 4.6c2.6 0 4 1.9 4 3.6 0 1.4-1.1 2.3-1.1 3.8s1.6 2.3 1.6 4c0 2-1.7 3.4-4.1 3.4S5 18 5 16c0-1.7 1.6-2.5 1.6-4S5.5 9.6 5.5 8.2c0-1.7 1.3-3.6 3.7-3.6Z" />
      <path d="M6.9 9.6h4.6M6.6 14.4h5" />
      <path d="M16 8.4c2 0 3.2 1.5 3.2 3.4S18 15.4 16 15.4" />
    </>
  ),
  // steel tumbler
  dairy: (
    <>
      <path d="M7.6 5h8.8l-1.2 14H8.8L7.6 5Z" />
      <path d="M7.9 8.4h8.2" />
      <path d="M8.5 15.2h7" />
    </>
  ),
  // fish
  meat: (
    <>
      <path d="M3.5 12c3-3.6 6.2-5.4 9.6-5.4 3.5 0 5.9 1.9 7.4 5.4-1.5 3.5-3.9 5.4-7.4 5.4-3.4 0-6.6-1.8-9.6-5.4Z" />
      <path d="M3.5 12 6.9 9v6L3.5 12Z" />
      <circle cx="16.2" cy="10.7" r="0.85" />
    </>
  ),
  // egg with a hairline crack
  eggs: (
    <>
      <path d="M12 3.6c3.3 0 6 4.2 6 8.2A6 6 0 0 1 6 11.8c0-4 2.7-8.2 6-8.2Z" />
      <path d="m9.6 11.4 1.8 1.1-1.2 1.5 2 1" />
    </>
  ),
  // dark green leaves (palakura / gongura)
  dglv: (
    <>
      <path d="M12 20.5c0-6.4 2.6-10.4 8-11.9.6 6.7-2 10.9-8 11.9Z" />
      <path d="M12 20.5C12 14.1 9.4 10.1 4 8.6c-.6 6.7 2 10.9 8 11.9Z" />
      <path d="M12 20.5V12" />
    </>
  ),
  // mango
  vitaminA: (
    <>
      <path d="M14.6 5.2c3 0 5 2.7 5 6.1 0 4.2-3.3 7.7-7.2 7.7-3.4 0-6.3-2.5-6.3-5.9 0-4.4 4.2-7.9 8.5-7.9Z" />
      <path d="M14.2 5.2c.5-1 1.4-1.7 2.7-2" />
      <path d="M10.2 9.6c-1.4 1.2-2.1 2.6-2.2 4.3" />
    </>
  ),
  // brinjal (vankaya)
  otherVeg: (
    <>
      <path d="M15.8 8.4c2 1.6 2.6 4.2 1.3 6.6-1.5 2.8-4.7 4.2-7.5 3.2-2.5-.9-3.7-3.3-3-5.9.8-3 3.7-5.1 6.6-4.6" />
      <path d="M13.2 7.7c-.5-1.5.1-2.9 1.6-3.7.5 1.3 1.6 2 3.1 2-.4 1.6-1.6 2.5-3.3 2.5" />
    </>
  ),
  // banana
  otherFruit: (
    <>
      <path d="M4.8 10.2c.9 5.2 4.4 8.2 9.2 8.2 3.2 0 5.4-1.5 6.2-4-2.2.9-4 .7-5.4-.7" />
      <path d="M4.8 10.2c-.7-1-.9-2-.6-3.1 1.5.6 2.4 1.5 2.8 2.7" />
      <path d="M14.8 13.7c-1.7-1.7-2.9-3.9-3.6-6.6" />
    </>
  ),
};

export function GroupGlyph({
  id,
  filled = false,
  className = "",
}: {
  id: FoodGroupId;
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={filled ? 1.6 : 1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[id]}
    </svg>
  );
}
