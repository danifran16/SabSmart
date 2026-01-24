import { BrowserRouter, Routes, Route } from "react-router-dom"

//Layouts
// import Navbar from "../src/components/layout/Navbar"
// import Sidebar from "../src/components/layout/Sidebar"

//Pages
import LoginPage from "../src/auth/LoginPage"
import Signup from "../src/auth/Signup"
//Usuario
import DashboardUser from "../src/pages/dashboard/user/DashboardUser"
import ClientesUser from "../src/pages/dashboard/user/ClientesUser"
import PedidosUser from "../src/pages/dashboard/user/PedidosUser"
import NotifUser from "../src/pages/dashboard/user/NotifUser"
//Protected Route

import ProtectedRoute from "../src/auth/ProtectedRoute"

function Approuter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />  

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardUser />
            </ProtectedRoute>
          }/>

        <Route 
          path="/clientes" 
          element={
            <ProtectedRoute>
              <ClientesUser />
            </ProtectedRoute>
          }/>

        <Route 
          path="/pedidos" 
          element={
            <ProtectedRoute>
              <PedidosUser />
            </ProtectedRoute>
          }/>

        <Route 
          path="/notificaciones" 
          element={
            <ProtectedRoute>
              <NotifUser />
            </ProtectedRoute>
          }/>







        
      </Routes>
    </BrowserRouter>
  );
}

export default Approuter