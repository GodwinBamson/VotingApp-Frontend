
import { useEffect, useState } from "react";
import "../css/Dashboard.css";
import axios from "axios";
import CircularProgress from "./CircularProgress";
import { BASE_URL } from "../../config";

const Dashboard = () => {
  // const [totalUsers, setTotalUsers] = useState(0);
  // const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const maxSalesTarget = 100000;  // <- Set your daily target here

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/dashboards/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.ok) {
          // setTotalUsers(res.data.totalUsers || 0);
          // setTotalAdmins(res.data.totalAdmins || 0);
          setTotalStaff(res.data.totalStaff || 0);
          setTotalProducts(res.data.totalProducts || 0);
          setTotalSales(res.data.totalSales || 0);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("An error occurred while fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const salesPercentage = totalSales > 0 
    ? Math.min((totalSales / maxSalesTarget) * 100, 100)
    : 0;

  return (
    <div className="dashboard">
      <h1 className="dashboard-h1">
        <span>Dashboard</span> Overview
      </h1>

      <div className="dashboard-container">
        <div className="dashboard-box first">
          <h2>Daily Sales</h2>
          <CircularProgress 
            progress={salesPercentage}
            size={130}
            color="#4caf50"
          >
            <span className="dashboard-sale">₦{totalSales}</span>
          </CircularProgress>
        </div>

        <div className="dashboard-box">
          <h2>Total Products</h2>
          <CircularProgress progress={totalProducts} size={130} color="#8800ff" />
        </div>

        <div className="dashboard-box">
          <h2>Total Staff</h2>
          <CircularProgress progress={totalStaff} size={130} color="#e91e63" />
        </div>

        {/* <div className="dashboard-box">
          <h2>Total Admins</h2>
          <CircularProgress progress={totalAdmins} size={130} color="#ff9800" />
        </div>

        <div className="dashboard-box">
          <h2>Total Users</h2>
          <CircularProgress progress={totalUsers} size={130} color="rgb(5, 122, 118)" />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;

