import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import logoUrl from '../assets/logo.svg';

export default function Navbar({ theme, setTheme }) {
  const navigate = useNavigate();

  const handleCreateSecureChat = () => {
    // Generate a unique session token
    const secureToken = crypto.randomUUID();
    navigate(`/chat/${secureToken}`);
  };

  return (
    <header className="sticky top-0 z-30 mx-auto w-full max-w-[1400px] bg-transparent px-3 py-4 sm:px-6">
      <div className="card flex h-16 items-center justify-between px-4 shadow-soft backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src={logoUrl} alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Secure<span className="text-brand-500">Baat</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleCreateSecureChat}
            className="hidden sm:block rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 active:scale-95"
          >
            Create Secure Chat
          </button>
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
          
          <DarkModeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
      
      {/* Mobile Action Button */}
      <div className="mt-2 sm:hidden">
        <button
          onClick={handleCreateSecureChat}
          className="w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white shadow-lg"
        >
          + New Secure Session
        </button>
      </div>
    </header>
  );
}