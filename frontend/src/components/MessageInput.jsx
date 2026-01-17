import { useRef, useState } from 'react';
import AttachmentMenu from './AttachmentMenu';
import EmojiPicker from './EmojiPicker';

export default function MessageInput({ onSend }) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const inputRef = useRef(null);
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);

 


  const submit = (e) => {
    e.preventDefault();
    if (!value.trim() && !selectedFile) return;

    onSend(value, selectedFile);
    
    setValue('');
    setSelectedFile(null);
    setEmojiOpen(false);
    setOpen(false);
  };


   // ADD this helper function at top (inside file)
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const onFiles = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // size limit (2MB recommended)
  if (file.size > 2 * 1024 * 1024) {
    alert("File size must be under 2MB");
    return;
  }

  const base64 = await fileToBase64(file);

  setSelectedFile({
    name: file.name,
    type: file.type,
    data: base64, // 🔥 THIS is what will be sent
  });
e.target.value = null;

  setOpen(false);
};


  const handleEmojiSelect = (emoji) => {
    setValue((prev) => prev + emoji);
    inputRef.current?.focus(); // Keep focus on text box
  };

  return (
    <div className="relative">
      {/* 1. MEDIA PREVIEW */}
      {selectedFile && (
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-gray-50 p-2 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
        {selectedFile.type?.startsWith('image') ? (
           <img
  src={selectedFile.data}
  className="h-12 w-12 rounded-lg object-cover"
  alt="preview"
/>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-2xl">📄</div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-xs font-bold text-gray-700 dark:text-gray-200">{selectedFile.name}</p>
            <p className="text-[10px] text-gray-500">Selected - Ready to send</p>
          </div>
          <button 
            type="button"
            onClick={() => setSelectedFile(null)}
            className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={submit} className="flex items-center gap-2">
        {/* ATTACHMENT BUTTON */}
        <button
          type="button"
          onClick={() => {
            setOpen(!open);
            setEmojiOpen(false);
          }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          📎
        </button>

        {/* EMOJI BUTTON - This was missing */}
        <button
          type="button"
          onClick={() => {
            setEmojiOpen(!emojiOpen);
            setOpen(false);
          }}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${
            emojiOpen ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800'
          } text-xl`}
        >
          😊
        </button>
        
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={selectedFile ? "Add a caption..." : "Type a message"}
          className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900"
        />

        <button type="submit" className="btn-primary px-5 py-2.5">
          Send
        </button>
      </form>

      {/* HIDDEN INPUTS */}
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={onFiles} />
      <input ref={docInputRef} type="file" className="hidden" onChange={onFiles} />

      {/* MENUS */}
      <AttachmentMenu 
        open={open} 
        onClose={() => setOpen(false)} 
        onSelect={(key) => {
          if (key === 'image') imageInputRef.current?.click();
          else docInputRef.current?.click();
        }} 
      />

      <EmojiPicker 
        open={emojiOpen} 
        onClose={() => setEmojiOpen(false)} 
        onSelect={handleEmojiSelect} 
      />
    </div>
  );
}