import image from '../assets/mld.png'

export default function APropos() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">A propos</h1>

      <img src={image} alt="Presentation de la plateforme" className="w-full max-w-xl rounded-box shadow" />
    </div>
  )
}
