import image from '../assets/mld.png'

export default function APropos() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">A propos</h1>
      <p className="text-lg">Cet plateforme a pour but de faciliter la mise en relation entre les étudiants et les entreprises pour des stages à Madagascar.</p>

      <img src={image} alt="Presentation de la plateforme" className="w-full max-w-xl rounded-box shadow" />
    </div>
  )
}
