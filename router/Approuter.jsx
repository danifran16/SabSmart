import { BrowserRouter, Routes, Route } from "react-router-dom"

//Pages
import LoginPage from "../src/auth/LoginPage"
import Signup from "../src/auth/Signup"

//Usuario
import DashboardUser from "../src/pages/user/Dashboard/DashboardUser"
import ClientesUser from "../src/pages/user/Clientes/ClientesUser"
import PedidosUser from "../src/pages/user/PedidosUser/PedidosUser"
import TareasUser from "../src/pages/user/Tareas/TareasUser"
import NotifUser from "../src/pages/user/Notif/NotifUser"

// Cliente
import DashboardClient from "../src/pages/client/Dashboard/DashboardUser"
import PedidosClient from "../src/pages/client/Pedidos/PedidosClient"

//Protected Route
import ProtectedRoute from "../src/auth/ProtectedRoute"

function Approuter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LoginPage />} />

        <Route
          path="/signup"
          element={<Signup />} />

        {/* Vistas Usuario */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardUser />
            </ProtectedRoute>
          } />

        <Route
          path="/clientes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ClientesUser />
            </ProtectedRoute>
          } />

        <Route
          path="/pedidos"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PedidosUser />
            </ProtectedRoute>
          } />

        <Route
          path="/tareas"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TareasUser />
            </ProtectedRoute>
          } />

        <Route
          path="/notificaciones"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <NotifUser />
            </ProtectedRoute>
          } />

        {/* Vistas Cliente */}
        <Route
          path="/mi-dashboard"
          element={
            <ProtectedRoute allowedRoles={["cliente"]}>
              <DashboardClient />
            </ProtectedRoute>
          } />

        <Route
          path="/mis-pedidos"
          element={
            <ProtectedRoute allowedRoles={["cliente"]}>
              <PedidosClient />
            </ProtectedRoute>
          } />

      </Routes>
    </BrowserRouter >
  );
}

export default Approuter