import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, isAdmin = false }) {
  const token = isAdmin 
    ? localStorage.getItem('adminToken')
    : localStorage.getItem('token');

  if (!token) {
    return <Navigate to={isAdmin ? '/admin-login' : '/login'} />;
  }

  return children;
}
