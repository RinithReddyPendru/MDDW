import { motion } from "framer-motion";

const EMOJIS = ["🥑", "🥕", "🥚", "🥛", "🍌", "🥬", "🍗", "🍎", "🍍", "🍆"];

export function FloatingBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-[0.06]">
      {EMOJIS.map((emoji, i) => {
        // Distribute them across the screen randomly
        const left = `${(i * 10 + Math.random() * 5) % 100}%`;
        const top = `${(i * 12 + Math.random() * 5) % 100}%`;
        const size = `${30 + Math.random() * 20}px`;
        
        // Random duration and delay for custom floating cadence
        const duration = 20 + Math.random() * 20;
        const delay = -Math.random() * 15;
        
        return (
          <motion.div
            key={i}
            className="absolute font-sans"
            style={{
              left,
              top,
              fontSize: size,
            }}
            animate={{
              y: [0, -40, 40, 0],
              x: [0, 30, -30, 0],
              rotate: [0, 180, -180, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.div>
        );
      })}
    </div>
  );
}
