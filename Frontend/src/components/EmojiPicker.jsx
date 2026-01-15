import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
  '🥴', '🤢', '🤮', '🤧', '🤨', '🧐', '👍', '👎', '❤️', '🔥'
];

export default function EmojiPicker({ open, onClose, onSelect }) {
  const pickerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  const variants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.95 }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={pickerRef}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          className="absolute bottom-16 left-0 z-50 h-64 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex h-10 items-center border-b px-4 py-2 dark:border-gray-800">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Emojis</span>
          </div>
          <div className="grid h-52 grid-cols-8 gap-1 overflow-y-auto p-2 scrollbar-hide">
            {EMOJIS.map((emoji, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelect(emoji)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl transition hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-90"
              >
                {emoji}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}