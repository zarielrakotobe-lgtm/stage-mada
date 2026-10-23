import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { messageErreur } from '../api.js'

export default function Inscription() {
  const [role, setRole] = useState('etudiant')
  const [champs, setChamps] = useState({})
  const [fichier, setFichier] = useState(null)
  const [erreur, setErreur] = useState('')
  const navigate = useNavigate()

  const changer = (nom) => (e) => setChamps({ ...champs, [nom]: e.target.value })
  const valeur = (nom) => champs[nom] || ''

  function changerRole(e) {
    const { nom, email, password } = champs
    setRole(e.target.value)
    setChamps({ nom, email, password })
    setFichier(null)
  }

  async function envoyer(e) {
    e.preventDefault()
    setErreur('')

    const data = new FormData()
    data.append('role', role)
    for (const cle in champs) {
      if (champs[cle] !== undefined) data.append(cle, champs[cle])
    }
    if (fichier) data.append(role === 'etudiant' ? 'profile' : 'logo', fichier)

    try {
      await api.post('/inscription/', data)
      alert('Compte créé ! Vous pouvez vous connecter.')
      navigate('/connexion')
    } catch (err) {
      setErreur(messageErreur(err))
    }
  }

  const champ = 'input input-bordered w-full'

  return (
    <form className="card bg-base-200 shadow-xl max-w-md mx-auto" onSubmit={envoyer}>
      <div className="card-body gap-3">
        <h2 className="card-title text-2xl">Inscription</h2>
        {erreur && <div className="alert alert-error">{erreur}</div>}

        <select className="select select-bordered w-full" value={role} onChange={changerRole}>
          <option value="etudiant">Etudiant</option>
          <option value="entreprise">Entreprise</option>
        </select>

        <input className={champ} placeholder={role === 'etudiant' ? 'Nom' : "Nom de l'entreprise"} required value={valeur('nom')} onChange={changer('nom')} />

        {role === 'etudiant' ? (
          <>
            <input className={champ} placeholder="Prénom" required value={valeur('prenom')} onChange={changer('prenom')} />
            <input className={champ} placeholder="Filière" required value={valeur('Filiere')} onChange={changer('Filiere')} />
          </>
        ) : (
          <>
            <input className={champ} placeholder="Ville" required value={valeur('ville')} onChange={changer('ville')} />
            <input className={champ} placeholder="Adresse" required value={valeur('Adresse')} onChange={changer('Adresse')} />
            <textarea className="textarea textarea-bordered w-full" placeholder="Description de l'entreprise" value={valeur('description')} onChange={changer('description')} />
          </>
        )}

        <input className={champ} type="email" placeholder="Email" required value={valeur('email')} onChange={changer('email')} />
        <input className={champ} type="password" placeholder="Mot de passe (6 caractères min.)" required minLength={6} value={valeur('password')} onChange={changer('password')} />

        <label className="label-text">{role === 'etudiant' ? 'Photo (facultatif)' : 'Logo (facultatif)'}</label>
        <input className="file-input file-input-bordered w-full" type="file" accept="image/*" onChange={(e) => setFichier(e.target.files[0])} />

        <button className="btn btn-primary">Créer mon compte</button>
      </div>
    </form>
  )
}
