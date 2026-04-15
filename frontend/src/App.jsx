import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import MapView from './pages/MapView.jsx'
import AddCragForm from './pages/AddCragForm.jsx'
import CragDetail from './pages/CragDetail.jsx'
import RouteDetail from './pages/RouteDetail.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

export default function App() {
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<MapView />} />
          <Route path="/crags/new" element={<AddCragForm />} />
          <Route path="/crags/:id" element={<CragDetail />} />
          <Route path="/routes/:id" element={<RouteDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  )
}
