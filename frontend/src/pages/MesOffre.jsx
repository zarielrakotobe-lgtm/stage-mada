import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api, { messageErreur } from '../api.js'
import Etat from '../composant/Etat.jsx'

export default function MesOffres() {
  const [offres, setOffres] = useState([])
  const [form, setForm] = useState({ titre: '', Duree: '', Date_limite: '', description: '' })
  const [erreur, setErreur] = useState('')

  function charger() {
    api.get('/mes-offres/').then((res) => setOffres(res.data))
  }
  useEffect(charger, [])

  const changer = (nom) => (e) => setForm({ ...form, [nom]: e.target.value })

  async function publier(e) {
    e.preventDefault()
    setErreur('')
    try {
      await api.post('/mes-offres/', form)
      setForm({ titre: '', Duree: '', Date_limite: '', description: '' })
      charger()                      
    } catch (err) {
      setErreur(messageErreur(err))
    }
  }

  async function supprimer(id) {
    if (!confirm('Supprimer cette offre ?')) return
    await api.delete(`/mes-offres/${id}/`)
    charger()
  }

  async function marquerPourvue(id) {
    await api.patch(`/mes-offres/${id}/`, { statut: 'pourvue' })
    charger()
  }

  const champ = 'input input-bordered w-full'

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Mes offres de stage</h1>

      <form className="card bg-base-200 shadow-xl max-w-md mb-8" onSubmit={publier}>
        <div className="card-body gap-3">
          <h3 className="card-title">Publier une nouvelle offre</h3>
          {erreur && <div className="alert alert-error">{erreur}</div>}
          <input className={champ} placeholder="Titre du stage" required value={form.titre} onChange={changer('titre')} />
          <input className={champ} placeholder="Durée (ex : 3 mois)" required value={form.Duree} onChange={changer('Duree')} />
          <label className="label-text">Date limite</label>
          <input className={champ} type="date" required value={form.Date_limite} onChange={changer('Date_limite')} />
          <textarea className="textarea textarea-bordered w-full" placeholder="Description du stage" required value={form.description} onChange={changer('description')} />
          <button className="btn btn-primary">Publier</button>
        </div>
      </form>

      <h2 className="text-2xl font-semibold mb-3">Offres publiées</h2>
      {offres.length === 0 && <p className="opacity-60">Aucune offre pour le moment.</p>}

      <div className="space-y-3">
        {offres.map((o) => (
          <div className="card bg-base-200 shadow" key={o.ref_off}>
            <div className="card-body">
              <h3 className="card-title">{o.titre}</h3>
              <p>Durée : {o.Duree} - Date limite : {o.Date_limite}</p>
              <p>Statut : <Etat statut={o.statut} /> — {o.nb_candidatures} candidature(s)</p>
              <div className="card-actions">
                <Link className="btn btn-primary btn-sm" to={`/mes-offres/${o.ref_off}/candidatures`}>Voir les candidatures</Link>
                {o.statut === 'ouverte' && (
                  <button className="btn btn-neutral btn-sm" onClick={() => marquerPourvue(o.ref_off)}>Marquer comme pourvue</button>
                )}
                <button className="btn btn-error btn-sm" onClick={() => supprimer(o.ref_off)}>Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
