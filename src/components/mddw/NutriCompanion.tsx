import { motion } from "framer-motion";

interface Props {
  message: string;
  compact?: boolean;
}

export function NutriCompanion({ message, compact }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
      className={`flex items-start gap-3 rounded-2xl glass border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 shadow-sm ${
        compact ? "p-2.5" : "p-4"
      }`}
    >
      <motion.img
        src="/asha_companion.png"
        alt="ASHA Companion"
        className={`object-contain rounded-full border border-primary/20 shrink-0 bg-background/50 shadow-sm ${
          compact ? "w-11 h-11" : "w-16 h-16 md:w-20 md:h-20"
        }`}
        animate={{
          y: [0, -3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className={`relative flex-1 bg-card border border-border rounded-xl font-semibold leading-relaxed text-foreground shadow-sm ${
        compact ? "p-2.5 text-xs" : "p-4 text-sm"
      }`}>
        {/* Triangle caret for speech bubble */}
        <div className={`absolute bg-card border-l border-b border-border rotate-45 ${
          compact ? "top-4 -left-[5px] w-2 h-2" : "top-6 -left-[7px] w-3 h-3"
        }`} />
        <p className="m-0 leading-tight">{message}</p>
      </div>
    </motion.div>
  );
}
