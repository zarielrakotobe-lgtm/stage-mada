import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api.js'
import Etat from '../composant/Etat.jsx'

export default function CandidaturesOffre() {
  const { id } = useParams()
  const [liste, setListe] = useState([])

  function charger() {
    api.get(`/mes-offres/${id}/candidatures/`).then((res) => setListe(res.data))
  }
  useEffect(charger, [id])

  
  async function decider(codeCand, statut) {
    await api.patch(`/candidature/${codeCand}/statut/`, { statut })
    charger()
  }

  return (
    <div>
      <Link to="/mes-offres" className="link link-primary">Retour à mes offres</Link>
      <h1 className="text-3xl font-bold my-4">Candidatures recues</h1>
      {liste.length === 0 && <p className="opacity-60">Aucune candidature pour cette offre.</p>}

      <div className="space-y-3">
        {liste.map((c) => (
          <div className="card bg-base-200 shadow" key={c.Code_can}>
            <div className="card-body">
              <h3 className="card-title">{c.etudiant_nom}</h3>
              <p>{c.etudiant_email} — Filière : {c.etudiant_Filiere}</p>
              <p>Reçue le {c.date} — <Etat statut={c.statut} /></p>
              <div className="card-actions">
                <a className="btn btn-neutral btn-sm" href={c.cv} target="_blank" rel="noreferrer">Voir le CV</a>
                <a className="btn btn-neutral btn-sm" href={c.lm} target="_blank" rel="noreferrer">Voir la lettre</a>
                {c.statut === 'en_attente' && (
                  <>
                    <button className="btn btn-success btn-sm" onClick={() => decider(c.Code_can, 'acceptee')}>Accepter</button>
                    <button className="btn btn-error btn-sm" onClick={() => decider(c.Code_can, 'refusee')}>Refuser</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
