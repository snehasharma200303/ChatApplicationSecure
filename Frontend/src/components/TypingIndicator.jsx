export default function TypingIndicator({ name }) {
  return (
    <div className="flex items-center gap-2 px-2 text-xs text-gray-500 dark:text-gray-400">
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]"></span>
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"></span>
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]"></span>
      </div>
      <span>{name} is typing…</span>
    </div>
  )
}