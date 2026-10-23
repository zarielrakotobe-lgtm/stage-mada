export default function Etat({ statut }) {
  const couleurs = {
    ouverte: 'badge-success',
    pourvue: 'badge-info',
    expiree: 'badge-error',
    en_attente: 'badge-warning',
    acceptee: 'badge-success',
    refusee: 'badge-error',
  }

  return <span className={'badge ' + (couleurs[statut] || '')}>{statut}</span>
}
