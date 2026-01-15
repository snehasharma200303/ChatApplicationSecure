import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';

export default function ChatDashboard() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  // State for the landing page lobby
  const [generatedToken, setGeneratedToken] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = () => {
    const newToken = crypto.randomUUID();
    setGeneratedToken(newToken);
  };

  const shareableLink = `${window.location.origin}/chat/${generatedToken}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // PAGE 1: Landing Page (Lobby)
  if (!token) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Privacy-First Chat
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Generate a unique link to start an ephemeral session. 
              No data is ever stored.
            </p>
          </div>

          {!generatedToken ? (
            <button
              onClick={handleGenerateLink}
              className="w-full rounded-2xl bg-brand-600 py-4 text-lg font-bold text-white shadow-xl transition hover:bg-brand-700 active:scale-95"
            >
              🛡️ Generate Secure Link
            </button>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Secure Link</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={shareableLink}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none dark:border-gray-800 dark:bg-gray-900"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    {copied ? '✅' : '📋'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => navigate(`/chat/${generatedToken}`)}
                className="w-full rounded-2xl bg-green-600 py-4 text-lg font-bold text-white shadow-xl transition hover:bg-green-700 active:scale-95"
              >
                🚪 Join Conversation
              </button>
              
              <button 
                onClick={() => setGeneratedToken(null)}
                className="text-xs text-gray-400 hover:underline"
              >
                Cancel and create new
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // PAGE 2: Chat Page
  return (
    <div className="h-[calc(100vh-100px)] py-4">
      <ChatWindow token={token} />
    </div>
  );
}