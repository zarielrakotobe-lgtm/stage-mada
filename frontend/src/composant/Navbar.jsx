import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import Notifications from './Notification.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function seDeconnecter() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar bg-base-200 shadow-lg px-6 flex-wrap gap-2">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-primary">Stage Madagascar</Link>
      </div>

      <div className="flex items-center gap-2">
        <Link to="/" className="btn btn-ghost btn-sm">Offres</Link>
        <Link to="/a-propos" className="btn btn-ghost btn-sm">A propos</Link>

        {user?.role === 'etudiant' && <Link to="/mes-candidatures" className="btn btn-ghost btn-sm">Mes candidatures</Link>}
        {user?.role === 'entreprise' && <Link to="/mes-offres" className="btn btn-ghost btn-sm">Mes offres</Link>}
        {user?.role === 'admin' && <Link to="/admin" className="btn btn-ghost btn-sm">Tableau de bord</Link>}
        {user?.role === 'admin' && <Link to="/admin/entreprises" className="btn btn-ghost btn-sm">Entreprises</Link>}
        {user?.role === 'admin' && <Link to="/admin/etudiants" className="btn btn-ghost btn-sm">Etudiants</Link>}

        {user ? (
          <>
            <Notifications />
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
