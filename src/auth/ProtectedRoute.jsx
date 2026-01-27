import { Navigate } from "react-router-dom";

// Recibe children para envolver el componente protegido que sera Dashboard
// allowedRoles = ['admin','cliente']
export default function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem('role');

  // Si no hay role, redirigir a login
  if (!role) return <Navigate to="/" replace />;

  // Si la ruta exige roles específicos y el role no está incluido -> login
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

