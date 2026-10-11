const FLOATING_ITEMS = [
  { emoji: "🥑", left: "8%", top: "15%", size: "36px", duration: "24s", delay: "0s" },
  { emoji: "🥕", left: "85%", top: "22%", size: "42px", duration: "28s", delay: "-4s" },
  { emoji: "🥚", left: "22%", top: "75%", size: "38px", duration: "22s", delay: "-8s" },
  { emoji: "🥛", left: "75%", top: "82%", size: "40px", duration: "26s", delay: "-12s" },
  { emoji: "🍌", left: "48%", top: "12%", size: "34px", duration: "30s", delay: "-6s" },
  { emoji: "🥬", left: "90%", top: "60%", size: "44px", duration: "25s", delay: "-14s" },
  { emoji: "🍗", left: "12%", top: "45%", size: "38px", duration: "27s", delay: "-10s" },
  { emoji: "🍎", left: "62%", top: "50%", size: "36px", duration: "23s", delay: "-16s" },
];

export function FloatingBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-[0.06]">
      <style>{`
        @keyframes floatGpu {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          25% { transform: translate3d(15px, -25px, 0) rotate(10deg); }
          50% { transform: translate3d(-10px, 20px, 0) rotate(-10deg); }
          75% { transform: translate3d(20px, 10px, 0) rotate(5deg); }
        }
      `}</style>
      {FLOATING_ITEMS.map((item, i) => (
        <div
          key={i}
          className="absolute font-sans"
          style={{
            left: item.left,
            top: item.top,
            fontSize: item.size,
            animation: `floatGpu ${item.duration} ease-in-out infinite`,
            animationDelay: item.delay,
            willChange: "transform",
          }}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  );
}
