import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../css/UnifiedLogin.css";
import { BASE_URL } from "../../config";
import { showSuccess, showError } from "../utils/toastService";

const UnifiedLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      // Already logged in, redirect based on role
      if (user.role === "superadmin") navigate("/add-admin");
else if (user.role === "admin") navigate("/dashboard");   // change to existing route
else if (user.role === "staff") navigate("/inventory");  // change to existing route

    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, form);
      const { token, user } = res.data;

      if (!token || !user) {
        showError("Invalid server response");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      login(user);  // Update context

      showSuccess(`Welcome back, ${user.username || user.email}!`);

      // Redirect based on role
      if (user.role === "superadmin") {
        navigate("/add-admin");
      } else if (user.role === "admin") {
        navigate("/add-staff");
      } else if (user.role === "staff") {
        navigate("/staff-dashboard");
      } else {
        showError("Unknown user role. Contact support.");
      }

    } catch (err) {
      console.error("Login error:", err);
      showError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-1">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>

        <input
          className="login-input"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? (
            <span className="spinner"></span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Inline Spinner CSS */}
      <style>
  {`
    .spinner {
      background: white;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-left-color: #0d6efd;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      animation: spin 0.5s linear infinite;
      display: inline-block;
      vertical-align: middle;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
</style>

    </div>
  );
};

export default UnifiedLogin;



// import { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import "../css/UnifiedLogin.css";
// import { BASE_URL } from "../../config";
// import { showSuccess, showError } from "../utils/toastService";

// const UnifiedLogin = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user) {
//       // Already logged in, redirect based on role
//       if (user.role === "superadmin") navigate("/add-admin");
//       else if (user.role === "admin") navigate("/dashboard");
//       else if (user.role === "staff") navigate("/inventory");
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post(`${BASE_URL}/api/auth/login`, form);
//       const { token, user } = res.data;

//       if (!token || !user) {
//         showError("Invalid server response");
//         return;
//       }

//       // ✅ Store token and user info in localStorage
//       localStorage.setItem("token", token);
//       localStorage.setItem("staffName", user.username); // ✅ Store staff name
//       localStorage.setItem("user", JSON.stringify(user));

//       login(user); // Update context

//       showSuccess(`Welcome back, ${user.username || user.email}!`);

//       // Redirect based on role
//       if (user.role === "superadmin") {
//         navigate("/add-admin");
//       } else if (user.role === "admin") {
//         navigate("/add-staff");
//       } else if (user.role === "staff") {
//         navigate("/staff-dashboard");
//       } else {
//         showError("Unknown user role. Contact support.");
//       }

//     } catch (err) {
//       console.error("Login error:", err);
//       showError(err.response?.data?.message || "Login failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container-1">
//       <form onSubmit={handleSubmit} className="login-form">
//         <h2>Login</h2>

//         <input
//           className="login-input"
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           className="login-input"
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           {loading ? <span className="spinner"></span> : "Login"}
//         </button>
//       </form>

//       {/* Inline Spinner CSS */}
//       <style>
//         {`
//           .spinner {
//             background: white;
//             border: 3px solid rgba(0, 0, 0, 0.1);
//             border-left-color: #0d6efd;
//             border-radius: 50%;
//             width: 18px;
//             height: 18px;
//             animation: spin 0.5s linear infinite;
//             display: inline-block;
//             vertical-align: middle;
//           }
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default UnifiedLogin;
