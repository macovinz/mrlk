import { motion, cubicBezier, type Variants } from "framer-motion";
import { X, Copy, RefreshCw } from "lucide-react";

const easeSoft = cubicBezier(0.2, 0.65, 0.3, 1);

const container: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.28 },
  },
};

const line: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeSoft },
  },
};

export default function HaikuModal({
  haiku,
  onAnother,
  onCopy,
  onClose,
}: {
  haiku: string;
  onAnother: () => void;
  onCopy: () => void;
  onClose: () => void;
}) {
  const lines = haiku.split("/").map((l) => l.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: easeSoft }}
        className="relative inline-block w-auto max-w-[92vw] rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-md"
      >
        <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-2 hover:bg-white/10" aria-label="Close">
          <X className="h-5 w-5" />
        </button>

        <motion.div variants={container} initial="hidden" animate="show">
          {lines.map((l, i) => (
            <motion.p key={i} variants={line} className="whitespace-pre text-xl leading-relaxed sm:text-2xl">
              {l}
            </motion.p>
          ))}
        </motion.div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button className="btn btn-outline" onClick={onAnother}>
            <RefreshCw className="mr-2 h-4 w-4" /> Another
          </button>
          <button className="btn btn-outline" onClick={onCopy}>
            <Copy className="mr-2 h-4 w-4" /> Copy
          </button>
        </div>
      </motion.div>
    </div>
  );
}
