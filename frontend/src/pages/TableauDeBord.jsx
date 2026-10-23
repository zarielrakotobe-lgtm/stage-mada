import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api, { messageErreur } from '../api.js'

export default function TableauDeBord() {
  const [stats, setStats] = useState(null)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    api.get('/admin/tableau-de-bord/')
      .then((res) => setStats(res.data))
      .catch((err) => setErreur(messageErreur(err)))
  }, [])

  if (erreur) return <div className="alert alert-error">{erreur}</div>
  if (!stats) return <p>Chargement...</p>

  const cartes = [
    { titre: 'Etudiants', valeur: stats.nb_etudiants },
    { titre: 'Entreprises', valeur: stats.nb_entreprises },
    { titre: 'Comptes bannis', valeur: stats.nb_bannis },
    { titre: 'Offres', valeur: stats.nb_offres },
    { titre: 'Offres ouvertes', valeur: stats.nb_offres_ouvertes },
    { titre: 'Candidatures', valeur: stats.nb_candidatures },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Tableau de bord</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {cartes.map((c) => (
          <div className="card bg-base-200 shadow" key={c.titre}>
            <div className="card-body">
              <p>{c.titre}</p>
              <h2 className="text-4xl font-bold">{c.valeur}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link to="/admin/entreprises" className="btn btn-primary">Voir les entreprises</Link>
        <Link to="/admin/etudiants" className="btn btn-primary">Voir les etudiants</Link>
      </div>
    </div>
  )
}
