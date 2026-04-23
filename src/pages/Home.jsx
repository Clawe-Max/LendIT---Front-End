import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useContext } from "react";
import { UserContext } from "../user/UserContext";
import { Navbar } from "../components/Navbar";
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
      <Navbar />
    </>
  );
}
export { Home };
