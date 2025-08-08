import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FormBuilder from './pages/FormBuilder'
import FormRenderer from './pages/FormRenderer'
import PrivateRoute from './components/PrivateRoute'
import Responses from './pages/Responses'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/form/:id" element={<FormRenderer />} />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/builder/:id?" element={
              <PrivateRoute>
                <FormBuilder />
              </PrivateRoute>
            } />
            <Route path="/form/:id/responses" element={
              <PrivateRoute>
                <Responses />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
