import axios from 'axios'

const api = axios.create({baseURL:(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000')+'/api'})

api.interceptors.request.use((plate_forme)=>{
    const token =localStorage.getItem('access')
    if (token) plate_forme.headers.Authorization = 'Bearer ' + token
    return plate_forme
})

export function messageErreur(err){
    const data = err.response?.data
    if(!data) return "Impossible de connecter le server"
    if(typeof data ==='string') return "Erreur du serveur"
    if(Array.isArray(data))return data.join('')
    if(data.detail) return data.detail
    return Object.entries(data)
        .map(([champ ,msg])=> `${champ}: ${Array.isArray(msg) ? msg.join('') : msg}`)
        .join('|')
}
export default api 
