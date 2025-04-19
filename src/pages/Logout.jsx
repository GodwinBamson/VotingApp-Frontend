
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccess, showError } from "../utils/toastService";

const BASE_URL = "http://localhost:5000"; // Replace with your actual backend URL

const Logout = ({ setRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "";

    axios
      .post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true })
      .then(() => {
        // Clear all relevant data
        setRole("");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("token");

        showSuccess("Logged out successfully!");

        // Optional: Redirect to role-specific login page
        switch (role) {
          case "superadmin":
            navigate("/superadmin-login");
            break;
          case "admin":
            navigate("/admin-login");
            break;
          case "staff":
            navigate("/staff-login");
            break;
          default:
            navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Logout Error:", err);
        showError("Logout failed, but session has been cleared locally.");

        // Clear anyway and redirect to general login
        setRole("");
        localStorage.clear();
        navigate("/login");
      });
  }, [setRole, navigate]);

  return <p>Logging out...</p>;
};

export default Logout;

