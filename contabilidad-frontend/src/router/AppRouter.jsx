// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import MainLayout from "../layouts/MainLayout";
import AsientosContablesPage from "../pages/NuevoAsiento/AsientosContablesPage";
import PlanCuentasPage from "../pages/PlanCuentas/PlanCuentasPage";
import LibroDiarioPage from "../pages/LibroDiario/LibroDiarioPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Todas las páginas del sistema usan MainLayout */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Navigate to="dashboard-inicio" />} />
          <Route path="dashboard-inicio"    element={<DashboardPage />} />
          <Route path="plan-cuentas" element={<PlanCuentasPage />} />
          <Route path="asientos-contables" element={<AsientosContablesPage />} />
          <Route path="libro-diario" element={<LibroDiarioPage />} />        
        </Route>
      </Routes>
    </BrowserRouter>
  );
}