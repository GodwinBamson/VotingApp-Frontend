
// import { useContext } from "react";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
//   useNavigate,
//   useLocation
// } from "react-router-dom";
// import { AuthProvider, AuthContext } from "./context/AuthContext";

// import Navbar from "./pages/Navbar";
// import UnifiedLogin from "./pages/UnifiedLogin";
// import AddAdmin from "./pages/AddAdmin";
// import AddProduct from "./pages/AddProduct";
// import Inventory from "./pages/Inventory";
// import AdminRegister from "./pages/AdminRegister";
// import ReportPage from "./pages/ReportPage";
// import Dashboard from "./pages/Dashboard";
// import AddStaff from "./pages/AddStaff";

// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AppRoutes = () => {
//   const location = useLocation();
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const isSuperAdmin = user?.role === "superadmin";
//   const isAdmin = user?.role === "admin";
//   const isStaff = user?.role === "staff";

//   const handleLogout = () => {
//     logout();             // Clear user session
//     navigate("/");        // Redirect to login page
//   };

//   return (
//     <>
//       {user && <Navbar role={user.role} onLogout={handleLogout} />}

//       <Routes>
//         {/* Unified Login for Superadmin, Admin & Staff */}
//         <Route path="/" element={<UnifiedLogin />} />

//         {/* Super Admin Routes */}
//         <Route
//           path="/add-admin"
//           element={isSuperAdmin ? <AddAdmin /> : <Navigate to="/" replace />}
//         />

//         {/* Admin Routes */}
//         <Route
//           path="/addproduct"
//           element={isAdmin ? <AddProduct /> : <Navigate to="/" replace />}
//         />
//         <Route
//           path="/admin-register"
//           element={isAdmin ? <AdminRegister /> : <Navigate to="/" replace />}
//         />
//         <Route
//           path="/reportpage"
//           element={isAdmin ? <ReportPage /> : <Navigate to="/" replace />}
//         />
//         <Route
//           path="/inventory"
//           element={(isAdmin || isStaff) ? <Inventory /> : <Navigate to="/" replace />}
//         />
//         <Route
//           path="/add-staff"
//           element={isAdmin ? <AddStaff key={location.pathname} /> : <Navigate to="/" replace />}
//         />

//         {/* Shared Route: Admin & Superadmin */}
//         <Route
//           path="/dashboard"
//           element={user ? <Dashboard /> : <Navigate to="/" replace />}
//         />

//         {/* Catch-all for unknown routes */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </>
//   );
// };

// const App = () => (
//   <AuthProvider>
//     <BrowserRouter>
//       <AppRoutes />
//       <ToastContainer position="top-right" autoClose={3000} />
//     </BrowserRouter>
//   </AuthProvider>
// );

// export default App;


import { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Navbar from "./pages/Navbar";
import UnifiedLogin from "./pages/UnifiedLogin";
import AddAdmin from "./pages/AddAdmin";
import AddProduct from "./pages/AddProduct";
import Inventory from "./pages/Inventory";
import AdminRegister from "./pages/AdminRegister";
import ReportPage from "./pages/ReportPage";
import Dashboard from "./pages/Dashboard";
import AddStaff from "./pages/AddStaff";
import DailyReportPage from "./pages/DailyReportPage";  // ✅ Import your new page

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppRoutes = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const isSuperAdmin = user?.role === "superadmin";
  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";

  const handleLogout = () => {
    logout();             // Clear user session
    navigate("/");        // Redirect to login page
  };

  return (
    <>
      {user && <Navbar role={user.role} onLogout={handleLogout} />}

      <Routes>
        {/* Unified Login for Superadmin, Admin & Staff */}
        <Route path="/" element={<UnifiedLogin />} />

        {/* Super Admin Routes */}
        <Route
          path="/add-admin"
          element={isSuperAdmin ? <AddAdmin /> : <Navigate to="/" replace />}
        />

        {/* Admin Routes */}
        <Route
          path="/addproduct"
          element={isAdmin ? <AddProduct /> : <Navigate to="/" replace />}
        />
        <Route
          path="/admin-register"
          element={isAdmin ? <AdminRegister /> : <Navigate to="/" replace />}
        />
        <Route
          path="/reportpage"
          element={isAdmin ? <ReportPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/inventory"
          element={(isAdmin || isStaff) ? <Inventory /> : <Navigate to="/" replace />}
        />
        <Route
          path="/add-staff"
          element={isAdmin ? <AddStaff key={location.pathname} /> : <Navigate to="/" replace />}
        />

        {/* ✅ Daily Report Route — Super Admin & Admin */}
        <Route
          path="/daily-report"
          element={(isSuperAdmin || isAdmin) ? <DailyReportPage /> : <Navigate to="/" replace />}
        />

        {/* Shared Route: Admin & Superadmin */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" replace />}
        />

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
