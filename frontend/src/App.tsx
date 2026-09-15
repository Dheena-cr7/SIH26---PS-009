import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Exploration from './pages/Exploration'
import Resources from './pages/Resources'
import Production from './pages/Production'
import Equipment from './pages/Equipment'
import Environment from './pages/Environment'
import AIInsights from './pages/AIInsights'
import Simulator from './pages/Simulator'
import DataCenter from './pages/DataCenter'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exploration" element={<Exploration />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/production" element={<Production />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/environment" element={<Environment />} />
          <Route path="/ai" element={<AIInsights />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/data" element={<DataCenter />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
