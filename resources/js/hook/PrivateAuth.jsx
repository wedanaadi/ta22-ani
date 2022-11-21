import AuthConsumer from "./Auth";
import {useLocation, Navigate} from 'react-router-dom'

export const RequiredAuth = ({ children }) => {
  const [authed] = AuthConsumer();
  const location = useLocation();
  return authed.auth === true ? (
    children
  ) : (
    <Navigate to={"/login"} replace state={{ path: location.pathname }} />
  );
};
