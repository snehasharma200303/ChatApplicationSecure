export default function ChatBubble({ mine, text, file, time, sender }) {
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[72%] rounded-2xl px-3 py-2 text-sm shadow-soft ${
        mine ? 'bg-brand-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-sm'
      }`}>
        

       {/* Render Image (Base64) */}
{file?.data && file.type?.startsWith('image') && (
  <div className="mb-2 overflow-hidden rounded-xl">
    <img
      src={file.data}
      alt={file.name}
      className="max-h-60 w-full object-contain"
    />
  </div>
)}

{/* Render Non-Image File (Base64 Download) */}
{file?.data && !file.type?.startsWith('image') && (
  <a
    href={file.data}
    download={file.name}
    className="mb-2 flex items-center gap-3 rounded-xl bg-black/10 p-3 transition hover:bg-black/20"
  >
    <span className="text-2xl">📄</span>
    <div className="flex-1 overflow-hidden">
      <p className="truncate text-xs font-bold">{file.name}</p>
      <p className="text-[10px] opacity-70 underline">Click to download</p>
    </div>
  </a>
)}


        {text && <div className="whitespace-pre-wrap leading-relaxed">{text}</div>}
        
        <div className={`mt-1 flex items-center gap-2 text-[10px] ${mine ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
          <span>{time}</span>
          <span>•</span>
          <span>{mine ? 'You' : sender}</span>
        </div>
      </div>
    </div>
  );
}
