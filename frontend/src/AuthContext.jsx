import { createContext, useContext, useState } from 'react'


const AuthContext = createContext()

export function AuthProvider({ children }) {
  
  const [user, setUser] = useState(() => {
    const role = localStorage.getItem('role')
    return role ? { role, nom: localStorage.getItem('nom') } : null
  })

  function login(data) {
    localStorage.setItem('access', data.access)
    localStorage.setItem('role', data.role)
    localStorage.setItem('nom', data.nom)
    setUser({ role: data.role, nom: data.nom })
  }

  function logout() {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
