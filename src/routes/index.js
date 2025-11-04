import { useRoutes } from "react-router-dom";

// routes
import MainRoutes from "./MainRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const tokenAdmin = localStorage.getItem("tokenAdmin"); // Set the authentication status here
  const tokenStaff = localStorage.getItem("tokenStaff");

  return useRoutes([
    AuthenticationRoutes,
    tokenAdmin || tokenStaff ? MainRoutes : [],
  ]);
}
