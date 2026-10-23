import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api.js'

export default function Accueil() {
  const [offres, setOffres] = useState([])
  const [recherche, setRecherche] = useState('')

  
  useEffect(() => {
    api.get('/offre/', { params: { q: recherche } })
      .then((res) => setOffres(res.data))
  }, [recherche])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Trouvez votre stage à Madagascar</h1>

      <input
        className="input input-bordered w-full mb-6"
        placeholder="Rechercher un stage, une entreprise"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
      />

      {offres.length === 0 && <p className="opacity-60">Aucune offre trouvée.</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offres.map((o) => (
          <div className="card bg-base-200 shadow" key={o.ref_off}>
            <div className="card-body">
              <h3 className="card-title">{o.titre}</h3>
              <p>Date de mise sur le site : {o.Date_post}</p>
              <p><strong>{o.nom_ent}</strong> — {o.ville_ent}</p>
              <p>Durée : {o.Duree}</p>
              <p>Date limite : {o.Date_limite}</p>
              <div className="card-actions justify-end">
              <Link to={`/offre/${o.ref_off}`} className="btn btn-primary btn-sm">Voir l'offre</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
