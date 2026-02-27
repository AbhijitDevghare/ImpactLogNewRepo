import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from './Loader/Loader';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authLoading } = useSelector((state) => state.auth);

  if (authLoading) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;