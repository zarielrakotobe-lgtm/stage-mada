import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'
import Navbar from './composant/Navbar.jsx'
import Accueil from './pages/Aceuil.jsx'
import Connexion from './pages/Connexion.jsx'
import Inscription from './pages/Inscriptions.jsx'
import DetailOffre from './pages/DetailOffre.jsx'
import MesCandidatures from './pages/MesCandidature.jsx'
import MesOffres from './pages/MesOffre.jsx'
import CandidaturesOffre from './pages/CandidatureOffre.jsx'
import APropos from './pages/APropos.jsx'
import TableauDeBord from './pages/TableauDeBord.jsx'
import ListeEntreprise from './pages/ListeEntreprise.jsx'
import ListeEtudiant from './pages/ListeEtudiant.jsx'


function Protege({ role, children }) {
  const { user } = useAuth()
  if (!user || user.role !== role) return <Navigate to="/connexion" />
  return children
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-5">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/offre/:id" element={<DetailOffre />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/a-propos" element={<APropos />} />

          <Route path="/mes-candidatures" element={
            <Protege role="etudiant"><MesCandidatures /></Protege>} />

          <Route path="/mes-offres" element={
            <Protege role="entreprise"><MesOffres /></Protege>} />
          <Route path="/mes-offres/:id/candidatures" element={
            <Protege role="entreprise"><CandidaturesOffre /></Protege>} />

          <Route path="/admin" element={
            <Protege role="admin"><TableauDeBord /></Protege>} />
          <Route path="/admin/entreprises" element={
            <Protege role="admin"><ListeEntreprise /></Protege>} />
          <Route path="/admin/etudiants" element={
            <Protege role="admin"><ListeEtudiant /></Protege>} />
        </Routes>
      </main>
    </>
  )
}
