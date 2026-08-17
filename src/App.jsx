import React, { useEffect, useState } from 'react'
import Portfolio from './pages/Portfolio'
import Admin from './pages/Admin'

export default function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  if (path.startsWith('/admin')) return <Admin />
  return <Portfolio />
}
