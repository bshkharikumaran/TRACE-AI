import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Investigations } from './pages/Investigations';
import { NetworkExplorer } from './pages/NetworkExplorer';
import { EmergingNetworks } from './pages/EmergingNetworks';
import { HiddenConnections } from './pages/HiddenConnections';
import { CoordinatedActivityView } from './pages/CoordinatedActivity';
import { FinancialIntel } from './pages/FinancialIntel';
import { TimelineIntel } from './pages/TimelineIntel';
import { OsintSearch } from './pages/OsintSearch';
import { DocumentIntel } from './pages/DocumentIntel';
import { InvestigationPriority } from './pages/InvestigationPriority';
import { EvidenceVault } from './pages/EvidenceVault';
import { AiInvestigator } from './pages/AiInvestigator';
import { AuditLogs } from './pages/AuditLogs';
import { SettingsPage } from './pages/Settings';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary fallbackTitle="Application View Error">
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Authenticated Workspace */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="investigations" element={<Investigations />} />
              <Route path="network" element={<NetworkExplorer />} />
              <Route path="emerging" element={<EmergingNetworks />} />
              <Route path="hidden" element={<HiddenConnections />} />
              <Route path="coordinated" element={<CoordinatedActivityView />} />
              <Route path="financial" element={<FinancialIntel />} />
              <Route path="timeline" element={<TimelineIntel />} />
              <Route path="osint" element={<OsintSearch />} />
              <Route path="documents" element={<DocumentIntel />} />
              <Route path="priority" element={<InvestigationPriority />} />
              <Route path="evidence" element={<EvidenceVault />} />
              <Route path="ai-investigator" element={<AiInvestigator />} />
              
              {/* Audit Logs: Restricted to Admin, Investigator, Auditor */}
              <Route
                path="audit-logs"
                element={
                  <ProtectedRoute allowedRoles={['administrator', 'investigator', 'auditor']}>
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />

              {/* Settings & Mode: Administrator only */}
              <Route
                path="settings"
                element={
                  <ProtectedRoute allowedRoles={['administrator']}>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
