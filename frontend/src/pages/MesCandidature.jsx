import { useState, useEffect } from 'react'
import api from '../api.js'
import Etat from '../composant/Etat.jsx'

export default function MesCandidatures() {
  const [liste, setListe] = useState([])

  useEffect(() => {
    api.get('/mes-candidatures/').then((res) => setListe(res.data))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Mes candidatures</h1>
      {liste.length === 0 && <p className="opacity-60">Vous n'avez encore postulé à aucune offre.</p>}

      <div className="space-y-3">
        {liste.map((c) => (
          <div className="card bg-base-200 shadow" key={c.Code_can}>
            <div className="card-body">
              <h3 className="card-title">{c.offre_titre}</h3>
              <p>{c.nom_ent} — envoyée le {c.date}</p>
              <div><Etat statut={c.statut} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
