import { useTranslation } from 'react-i18next';
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Inventory from './pages/Inventory'
import APIDetail from './pages/APIDetail'
import Security from './pages/Security'
import Graph from './pages/Graph'
import Simulator from './pages/Simulator'
import Alerts from './pages/Alerts'
import Analytics from './pages/Analytics'
import Dashboard from './pages/Dashboard'
import ChatbotWidget from './components/ChatbotWidget'
import EbpfControls from './components/EbpfControls'
import './index.css'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="inventory/:id" element={<APIDetail />} />
          <Route path="security" element={<Security />} />
          <Route path="graph" element={<Graph />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        {/* Legacy redirect for any old routes directly accessed */}
        <Route path="/inventory" element={<Navigate to="/dashboard/inventory" replace />} />
        <Route path="/security" element={<Navigate to="/dashboard/security" replace />} />
        <Route path="/graph" element={<Navigate to="/dashboard/graph" replace />} />
        <Route path="/simulator" element={<Navigate to="/dashboard/simulator" replace />} />
        <Route path="/alerts" element={<Navigate to="/dashboard/alerts" replace />} />
        <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatbotWidget />
    </Router>
  )
}
