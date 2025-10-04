import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/** Tiny per-letter reveal used for headings & haiku lines */
function Letters({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * 0.045, // faster cadence for poetry
            duration: 0.24,
            ease: [0.2, 0.65, 0.3, 1],
          }}
          className="inline-block will-change-transform"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function HaikuModal({
  haiku,
  onAnother,
  onClose,
}: {
  haiku: string;
  onAnother: () => void;
  onCopy: () => void;
  onClose: () => void;
}) {
  // Convert "line1 / line2 / line3" → ["line1", "line2", "line3"]
  const lines = haiku
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <AnimatePresence>
      <motion.div
        key="haiku-overlay"
        className="fixed inset-0 z-[90] grid place-items-center p-10 sm:p-6"
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* dark translucent backplate */}
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* content-sized card (max-width fits content) */}
        <motion.div
          key="haiku-card"
          initial={{ y: 16, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -12, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 0.7, 0.3, 1] }}
          className="
            relative z-10
            w-full max-w-[min(92vw,36rem)]
            rounded-2xl border border-white/25
            bg-white/12 backdrop-blur-xl
            shadow-[0_20px_80px_rgba(0,0,0,0.35)]
            px-6 sm:px-12 py-6 sm:py-7
            text-white
          "
          style={{ width: "max-content", maxWidth: "min(92vw, 36rem)" }}
        >
          {/* close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3.5 top-3.5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 hover:bg-white/15 backdrop-blur-md"
          >
            <X className="h-5 w-5" />
          </button>

          {/* haiku lines: per-letter reveal */}
          <div className="text-center">
            {lines.map((line, i) => (
              <div key={i} className={i ? "mt-2 sm:mt-2.5" : ""}>
                <Letters
                  text={line}
                  delay={i * 0.2}
                  className="text-m sm:text-1xl leading-relaxed"
                />
              </div>
            ))}
          </div>

          {/* actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={onAnother}
              className="rounded-full border border-white/40 bg-white/15 px-5 py-2.5 text-sm hover:bg-white/20 backdrop-blur-md"
            >
              Another
            </button>
            
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
