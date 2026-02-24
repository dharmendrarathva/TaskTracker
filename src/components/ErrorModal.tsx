"use client";

import { XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  message: string | null;
  onClose: () => void;
}

export default function ErrorModal({ message, onClose }: Props) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-md rounded-2xl border border-red-500/30 bg-neutral-900 shadow-2xl"
          >
            <div className="flex gap-3 p-5 border-b border-white/10">
              <XCircle className="text-red-400 mt-0.5" size={26} />
              <div>
                <h3 className="text-lg font-semibold text-red-400">
                  Error
                </h3>
                <p className="text-sm text-white/60">
                  Please fix the issue below
                </p>
              </div>
            </div>

            <div className="p-5">
              <p className="text-white/80 text-sm leading-relaxed">
                {message}
              </p>

              <button
                onClick={onClose}
                className="mt-6 w-full rounded-xl bg-red-500 hover:bg-red-600 transition py-2.5 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}