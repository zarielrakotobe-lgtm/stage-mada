import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api, { messageErreur } from '../api.js'
import { useAuth } from '../AuthContext.jsx'
import Etat from '../composant/Etat.jsx'

export default function DetailOffre() {
  const { id } = useParams()          
  const { user } = useAuth()
  const [offre, setOffre] = useState(null)
  const [cv, setCv] = useState(null)
  const [lm, setLm] = useState(null)
  const [message, setMessage] = useState('')
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    api.get(`/offre/${id}/`).then((res) => setOffre(res.data))
  }, [id])

  async function postuler(e) {
    e.preventDefault()
    setMessage('')
    setErreur('')

    const data = new FormData()
    data.append('offre', id)
    data.append('cv', cv)
    data.append('lm', lm)

    try {
      await api.post('/candidature/', data)
      setMessage('Votre candidature a bien été envoyée')
    } catch (err) {
      setErreur(messageErreur(err))
    }
  }

  if (!offre) return <p>Chargement...</p>

  return (
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">{offre.titre}</h1>
        <p>Date de postulation de l'offre : {offre.Date_post}</p>
        <p><strong>{offre.nom_ent}</strong> — {offre.ville_ent}</p>
        <p>Durée : {offre.Duree}</p>
        <p>Date limite : {offre.Date_limite}</p>
        <p>Statut : <Etat statut={offre.statut} /></p>
        <h3 className="text-xl font-semibold pt-2">Description</h3>
        <p>{offre.description}</p>
  
        
        {!user && <p><Link to="/connexion" className="link link-primary">Connectez-vous</Link> en tant qu'étudiant pour postuler.</p>}
  
        {user?.role === 'etudiant' && offre.statut === 'ouverte' && (
          <form className="card bg-base-200 shadow-xl max-w-md" onSubmit={postuler}>
            <div className="card-body gap-3">
              <h3 className="card-title">Postuler</h3>
              {message && <div className="alert alert-success">{message}</div>}
              {erreur && <div className="alert alert-error">{erreur}</div>}
  
              <label className="label-text">Votre CV</label>
              <input className="file-input file-input-bordered w-full" type="file" required onChange={(e) => setCv(e.target.files[0])} />
              <label className="label-text">Votre lettre de motivation</label>
              <input className="file-input file-input-bordered w-full" type="file" required onChange={(e) => setLm(e.target.files[0])} />
  
              <button className="btn btn-primary">Envoyer ma candidature</button>
            </div>
          </form>
        )}
      </div>
    )
}