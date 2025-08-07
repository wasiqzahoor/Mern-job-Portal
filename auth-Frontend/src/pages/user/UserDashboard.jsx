import { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import Navbar from "../../components/Navbar";
import UserHomePage from "./UserHomePage";
import Bottom from "./Bottom";



export default function UserDashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="bg-DarkGray min-h-screen">
      <Navbar />
      <UserHomePage/>
      <Bottom/>
    </div>
  );
}
