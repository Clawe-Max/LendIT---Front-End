import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useContext } from "react";
import { UserContext } from "../user/UserContext";
import api from "../api/axios";

const LOGOUT_URL = "/user/logout";

function Home() {
  const { user, loadingUser } = useContext(UserContext);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (loadingUser) {
    return;
    <></>;
  }
  return (
    <>
      {isAuthenticated ? (
        <a href="">
          <button className="cursor-pointer p-2 bg-red-500 text-white rounded-md">
            Logout
          </button>
        </a>
      ) : (
        <Link to="/Auth">Entrar</Link>
      )}
    </>
  );
}
export { Home };
