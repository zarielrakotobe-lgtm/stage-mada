import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import Notifications from './Notification.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false)

  function seDeconnecter() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar bg-base-200 shadow-lg px-3 sm:px-6 flex-wrap gap-2">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-primary">Stage Madagascar</Link>
      </div>

      {user && <Notifications />}

      <button className="btn btn-ghost btn-square lg:hidden" onClick={() => setMenu(!menu)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        className={(menu ? 'flex' : 'hidden') + ' lg:flex flex-col lg:flex-row items-stretch lg:items-center gap-2 w-full lg:w-auto'}
        onClick={() => setMenu(false)}
      >
        <Link to="/" className="btn btn-ghost btn-sm">Offres</Link>
        <Link to="/a-propos" className="btn btn-ghost btn-sm">A propos</Link>

        {user?.role === 'etudiant' && <Link to="/mes-candidatures" className="btn btn-ghost btn-sm">Mes candidatures</Link>}
        {user?.role === 'entreprise' && <Link to="/mes-offres" className="btn btn-ghost btn-sm">Mes offres</Link>}
        {user?.role === 'admin' && <Link to="/admin" className="btn btn-ghost btn-sm">Tableau de bord</Link>}
        {user?.role === 'admin' && <Link to="/admin/entreprises" className="btn btn-ghost btn-sm">Entreprises</Link>}
        {user?.role === 'admin' && <Link to="/admin/etudiants" className="btn btn-ghost btn-sm">Etudiants</Link>}

        {user ? (
          <>
            <span className="font-semibold">{user.nom}</span>
            <button className="btn btn-outline btn-sm" onClick={seDeconnecter}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/connexion" className="btn btn-ghost btn-sm">Connexion</Link>
            <Link to="/inscription" className="btn btn-primary btn-sm">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  )
}