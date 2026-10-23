import { useState, useEffect } from 'react'
import api, { messageErreur } from '../api.js'

export default function ListeEntreprise() {
  const [liste, setListe] = useState([])
  const [erreur, setErreur] = useState('')

  function charger() {
    api.get('/admin/entreprises/').then((res) => setListe(res.data))
  }
  useEffect(charger, [])

  async function bannir(id) {
    setErreur('')
    try {
      await api.patch(`/admin/utilisateur/${id}/bannir/`)
      charger()
    } catch (err) {
      setErreur(messageErreur(err))
    }
  }

  async function supprimer(id) {
    if (!confirm('Supprimer cette entreprise et toutes ses offres ?')) return
    setErreur('')
    try {
      await api.delete(`/admin/utilisateur/${id}/supprimer/`)
      charger()
    } catch (err) {
      setErreur(messageErreur(err))
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Entreprises : {liste.length}</h1>
      {erreur && <div className="alert alert-error mb-4">{erreur}</div>}
      {liste.length === 0 && <p className="opacity-60">Aucune entreprise inscrite.</p>}

      <div className="space-y-3">
        {liste.map((e) => (
          <div className="card bg-base-200 shadow" key={e.Code_ent}>
            <div className="card-body">
              <h3 className="card-title">
                {e.nom}
                {!e.actif && <span className="badge badge-error">Banni</span>}
              </h3>
              <p>{e.email} - {e.ville}, {e.Adresse}</p>
              <div className="card-actions">
                <button className="btn btn-neutral btn-sm" onClick={() => bannir(e.user)}>
                  {e.actif ? 'Bannir' : 'Reactiver'}
                </button>
                <button className="btn btn-error btn-sm" onClick={() => supprimer(e.user)}>Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
