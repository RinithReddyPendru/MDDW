import { motion } from "framer-motion";

interface Props {
  message: string;
}

export function NutriCompanion({ message }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
      className="flex items-start gap-4 p-4 rounded-3xl glass border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 shadow-sm"
    >
      <motion.img
        src="/asha_companion.png"
        alt="ASHA Companion"
        className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-full border-2 border-primary/30 shrink-0 bg-background/50 shadow-sm"
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="relative flex-1 bg-card border border-border rounded-2xl p-4 text-sm font-medium leading-relaxed text-foreground shadow-sm">
        {/* Triangle caret for speech bubble */}
        <div className="absolute top-6 -left-[7px] w-3 h-3 bg-card border-l border-b border-border rotate-45" />
        <p>{message}</p>
      </div>
    </motion.div>
  );
}
