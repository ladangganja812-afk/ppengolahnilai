/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { ProcessGrades } from "./pages/admin/ProcessGrades";
import { RiwayatKonversi } from "./pages/admin/RiwayatKonversi";
import { MasterData } from "./pages/admin/MasterData";
import { ManajemenGuru } from "./pages/admin/ManajemenGuru";
import { GuruDashboard } from "./pages/guru/Dashboard";

export default function App() {
  const [user, setUser] = useState<any>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <Login onLogin={setUser} />
        } />
        
        <Route path="/" element={<Layout user={user} onLogout={() => setUser(null)} />}>
          {user?.role === "admin" ? (
            <>
              <Route index element={<ProcessGrades user={user} />} />
              <Route path="riwayat" element={<RiwayatKonversi />} />
              <Route path="master" element={<MasterData />} />
              <Route path="guru" element={<ManajemenGuru />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route index element={<GuruDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
