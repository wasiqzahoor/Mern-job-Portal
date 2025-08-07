import { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import DashboardNavbar from "../../components/DashboardNavbar";
import CompanyDashboardBanner from "../../components/CompanyDashboardBanner";
import CompanyDashboardWidget from "./CompanyDashboardWidget";
import Footer from "./Footer";



export default function CompanyDashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="bg-DarkGray">
      <DashboardNavbar />
      <CompanyDashboardBanner/>
      <CompanyDashboardWidget/>
      <Footer/>
    </div>
  );
}
