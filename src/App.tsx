/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { DashboardLayout } from './components/layout/DashboardLayout.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { InstitutionsPage } from './pages/institutions/InstitutionsPage.tsx';
import { RandomAssignmentPage } from './pages/assignments/RandomAssignmentPage.tsx';
import { InspectorDashboard } from './pages/inspector/InspectorDashboard.tsx';
import { ChecklistPage } from './pages/checklist/ChecklistPage.tsx';
import { EvidenceVerificationPage } from './pages/verification/EvidenceVerificationPage.tsx';
import { FindingsPage } from './pages/findings/FindingsPage.tsx';
import { VideoInspectionPage } from './pages/video/VideoInspectionPage.tsx';
import { ManagerPortal } from './pages/manager/ManagerPortal.tsx';
import { ReportsPage } from './pages/reports/ReportsPage.tsx';
import { LoginPortal } from './pages/auth/LoginPortal.tsx';
import { InstitutionLogin } from './pages/auth/InstitutionLogin.tsx';
import { InspectorLogin } from './pages/auth/InspectorLogin.tsx';
import { AdminLogin } from './pages/auth/AdminLogin.tsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans">
          <Routes>
            {/* Landing Page with Top Navbar */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <LandingPage />
                </>
              }
            />

            {/* Dedicated Authentication Gateways */}
            <Route path="/login" element={<LoginPortal />} />
            <Route path="/login/institution" element={<InstitutionLogin />} />
            <Route path="/login/inspector" element={<InspectorLogin />} />
            <Route path="/login/admin" element={<AdminLogin />} />

            {/* Dashboard Sub-routes with Enterprise Sidebar & Header */}
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/institutions" element={<InstitutionsPage />} />
              <Route path="/assignments" element={<RandomAssignmentPage />} />
              <Route path="/inspector" element={<InspectorDashboard />} />
              <Route path="/checklist" element={<ChecklistPage />} />
              <Route path="/verification" element={<EvidenceVerificationPage />} />
              <Route path="/findings" element={<FindingsPage />} />
              <Route path="/video-inspection" element={<VideoInspectionPage />} />
              <Route path="/manager" element={<ManagerPortal />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
