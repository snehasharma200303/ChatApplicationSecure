import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import imgIcon from '../assets/icons/image.svg'
import vidIcon from '../assets/icons/video.svg'
import docIcon from '../assets/icons/document.svg'
import contactIcon from '../assets/icons/contact.svg'

export default function AttachmentMenu({ open, onClose, onSelect }) {
  const ref = useRef(null)
  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target)) onClose?.()
    }
    if (open) document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open, onClose])

  const variants = {
    hidden: { opacity: 0, y: 6, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { ease: [0.33, 1, 0.68, 1], duration: 0.15, staggerChildren: 0.04 } },
    exit: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { ease: [0.33, 1, 0.68, 1], duration: 0.14 } },
  }

  const items = [
    { key: 'image', label: 'Image', icon: imgIcon, color: 'hover:bg-brand-50' },
    { key: 'video', label: 'Video', icon: vidIcon, color: 'hover:bg-violet-50' },
    { key: 'doc', label: 'Document', icon: docIcon, color: 'hover:bg-blue-50' },
    { key: 'contact', label: 'Contact', icon: contactIcon, color: 'hover:bg-green-50' },
  ]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          className="card absolute bottom-14 left-0 w-44 overflow-hidden p-2 shadow-soft"
        >
          {items.map((it) => (
            <motion.button
              key={it.key}
              variants={itemVariants}
              onClick={() => onSelect?.(it.key)}
              className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-sm transition ${it.color} dark:hover:bg-gray-800`}
            >
              <img src={it.icon} alt="" className="h-5 w-5" />
              <span>{it.label}</span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}