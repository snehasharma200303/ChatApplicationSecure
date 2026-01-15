import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import ChatDashboard from './pages/ChatDashboard'
import Navbar from './components/Navbar'

export default function App() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  return (
    <div className="min-h-screen">
      <Navbar theme={theme} setTheme={setTheme} />

      <main className="mx-auto max-w-[1400px] px-3 sm:px-6">
        <Routes>
          {/* Home = chat create page */}
          <Route path="/" element={<ChatDashboard />} />

          {/* Token based chat */}
          <Route path="/chat/:token" element={<ChatDashboard />} />
        </Routes>
      </main>
    </div>
  )
}
