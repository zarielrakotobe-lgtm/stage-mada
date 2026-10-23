import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api, { messageErreur } from '../api.js'
import { useAuth } from '../AuthContext.jsx'

export default function Connexion() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function envoyer(e) {
    e.preventDefault()
    setErreur('')
    try {
      const res = await api.post('/connexion/', { email, password })
      login(res.data)
      if (res.data.role === 'admin') {
        navigate('/admin')
      } else if (res.data.role === 'entreprise') {
        navigate('/mes-offres')
      } else {
        navigate('/')
      }
    } catch (err) {
      setErreur(messageErreur(err))
    }
  }

  return (
    <form className="card bg-base-200 shadow-xl max-w-md mx-auto" onSubmit={envoyer}>
      <div className="card-body gap-3">
        <h2 className="card-title text-2xl">Connexion</h2>
        {erreur && <div className="alert alert-error">{erreur}</div>}

        <input className="input input-bordered w-full" type="text" placeholder="Email ou nom d'utilisateur" required
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input input-bordered w-full" type="password" placeholder="Mot de passe" required
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="btn btn-primary">Se connecter</button>
        <p>Pas de compte ? <Link to="/inscription" className="link link-primary font-bold ml-1 no-underline">Inscrivez-vous</Link></p>
      </div>
    </form>
  )
}
