import { useState, useEffect, useRef } from 'react'
import api from '../api.js'


export default function Notifications() {
  const [liste, setListe] = useState([])
  const [ouvert, setOuvert] = useState(false)
  const [popup, setPopup] = useState('')      
  const ancienNombre = useRef(null)           

  async function charger() {
    try {
      const res = await api.get('/notifications/')
      const nonLues = res.data.filter((n) => !n.lue).length

      
      if (ancienNombre.current !== null && nonLues > ancienNombre.current) {
        setPopup(res.data[0].message)
        setTimeout(() => setPopup(''), 5000)
      }
      ancienNombre.current = nonLues
      setListe(res.data)
    } catch {
      setListe([])
    }
  }

  
  useEffect(() => {
    charger()
    const minuteur = setInterval(charger, 10000)
    return () => clearInterval(minuteur)
  }, [])

  async function toutLire() {
    await api.post('/notifications/lire-tout/')
    charger()
  }

  const nonLues = liste.filter((n) => !n.lue).length

  return (
    <div className="relative">
      <button className="btn btn-ghost btn-circle" onClick={() => setOuvert(!ouvert)}>
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0" />
          </svg>
          {nonLues > 0 && <span className="badge badge-error badge-sm indicator-item">{nonLues}</span>}
        </div>
      </button>

      {ouvert && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-base-200 rounded-box shadow-xl z-50">
          <div className="flex justify-between items-center p-3 border-b border-base-300">
            <strong>Notifications</strong>
            {nonLues > 0 && <button className="link link-primary text-xs" onClick={toutLire}>Tout marquer comme lu</button>}
          </div>

          {liste.length === 0 && <p className="p-3 opacity-60">Aucune notification.</p>}

          {liste.map((n) => (
            <div key={n.id} className={'p-3 border-b border-base-300 ' + (n.lue ? '' : 'bg-primary/20')}>
              <p className="text-sm">{n.message}</p>
              <small className="opacity-60">{new Date(n.date_creation).toLocaleString('fr-FR')}</small>
            </div>
          ))}
        </div>
      )}

      {popup && (
        <div className="toast toast-end z-50">
          <div className="alert alert-info"><span>{popup}</span></div>
        </div>
      )}
    </div>
  )
}
