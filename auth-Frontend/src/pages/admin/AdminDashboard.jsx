import { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import AdminNavbar from "./AdminNavbar";
import AdminBanner from "./AdminBanner";
import RecentJobs from "./RecentJobs";
import AdminFooter from "./AdminFooter";



export default function AdminDashboard() {
  const { logout } = useContext(AuthContext);

  return (
    
    <>
    <AdminNavbar/>
    <AdminBanner/>
    <RecentJobs/>
    <AdminFooter/>
    </>
  );
}
