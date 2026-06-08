import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import { Layout } from './components/layout/Layout';

// Pages
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Predictions } from './pages/Predictions/Predictions';
import { RiskMap } from './pages/RiskMap/RiskMap';
import { Alerts } from './pages/Alerts/Alerts';
import { DataSources } from './pages/DataSources/DataSources';
import { Reports } from './pages/Reports/Reports';
import { Users } from './pages/Users/Users';
import { Settings } from './pages/Settings/Settings';
import { Profile } from './pages/Profile/Profile';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Redirect root to login */}
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="risk-map" element={<RiskMap />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="data-sources" element={<DataSources />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
