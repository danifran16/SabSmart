import { Navigate } from "react-router-dom";

// Recibe children para envolver el componente protegido que sera Dashboard
export default function ProtectedRoute({ children }) {
  
  const isAuth = !!localStorage.getItem("token");
  return isAuth ? children : <Navigate to="/" replace />;
}

