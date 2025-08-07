import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function Dashboard() {
  const { logout, role } = useContext(AuthContext);

  return (
    <div className="p-4">
      <h1>Welcome {role}</h1>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
        Logout
      </button>
    </div>
  );
}
