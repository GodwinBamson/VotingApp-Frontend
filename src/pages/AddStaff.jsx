
// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import { FaPen, FaTrash } from "react-icons/fa";
// import "../css/AddStaff.css";
// import { BASE_URL } from "../../config";
// import { showSuccess, showError } from "../utils/toastService";

// const AddStaff = () => {
//   const location = useLocation();
//   const [form, setForm] = useState({ username: "", email: "", password: "", role: "staff" });
//   const [staff, setStaff] = useState([]);
//   const [error, setError] = useState("");
//   const [editingUser, setEditingUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchStaffAndAdmins = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.error("No token found");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await axios.get(`${BASE_URL}/api/users/my-staff`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStaff(res.data);
//     } catch (error) {
//       console.error("Error fetching staff/admins:", error.response?.data || error.message);
//       setError(error.response?.data?.message || "Error fetching staff/admins");
//       showError(error.response?.data?.message || "Error fetching staff/admins");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStaffAndAdmins();  // Refetch when pathname changes
//   }, [location.pathname]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     const token = localStorage.getItem("token");

//     try {
//       if (editingUser) {
//         const res = await axios.put(
//           `${BASE_URL}/api/users/update-user/${editingUser._id}`,
//           form,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setStaff((prev) => prev.map((user) => (user._id === editingUser._id ? res.data.user : user)));
//         setEditingUser(null);
//         showSuccess("User updated successfully!");
//       } else {
//         const endpoint = form.role === "admin" ? "/add-admin" : "/add-staff";
//         const res = await axios.post(`${BASE_URL}/api/users${endpoint}`, form, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setStaff((prev) => [...prev, res.data.staff || res.data.admin]);
//         showSuccess(`${form.role === "admin" ? "Admin" : "Staff"} added successfully!`);
//       }

//       setForm({ username: "", email: "", password: "", role: "staff" });
//     } catch (error) {
//       console.error("Submit error:", error);
//       setError(error.response?.data?.message || "Something went wrong");
//       showError(error.response?.data?.message || "Failed to submit form.");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${BASE_URL}/api/users/staff/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStaff((prev) => prev.filter((user) => user._id !== id));
//       showSuccess("User deleted successfully!");
//     } catch (error) {
//       console.error("Delete error:", error.response?.data || error.message);
//       setError(error.response?.data?.message || "An error occurred while deleting the user.");
//       showError(error.response?.data?.message || "Failed to delete user.");
//     }
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setForm({ username: user.username, email: user.email, password: "", role: user.role });
//   };

//   return (
//     <div className="admin-register">
//       <div className="admin-register-div">
//         <h2>{editingUser ? "EDIT USER" : "ADD STAFF"}</h2>
//         <form onSubmit={handleSubmit} className="admin-register-form">
//           <input
//             name="username"
//             placeholder="Username"
//             value={form.username}
//             onChange={handleChange}
//             required
//           />
//           <br />
//           <input
//             name="email"
//             type="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             required
//           />
//           <br />
//           <input
//             name="password"
//             type="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             required={!editingUser}
//           />
//           <br />
//           <select name="role" value={form.role} onChange={handleChange} required>
//             <option value="staff">STAFF</option>
//             <option value="admin">ADMIN</option>
//           </select>
//           {error && <p style={{ color: "red" }}>{error}</p>}
//           <button type="submit">{editingUser ? "Update" : "Register"}</button>
//         </form>
//       </div>

//       <div className="admin-table-details">
//         <h3>ALL REGISTERED USERS</h3>
//         <br />
//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <div className="add-staff-table-div">
//               <table className="add-register-table" border="1">
//               <thead>
//                 <tr className="add-staff-role-head">
//                   <th>Username</th>
//                   <th>Email</th>
//                   <th>Role</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {staff.map((user) => (
//                   <tr key={user._id} className="add-staff-role">
//                     <td>{user.username}</td>
//                     <td>{user.email}</td>
//                     <td>{user.role}</td>
//                     <td className="add-buttons">
//                       <button onClick={() => handleEdit(user)}><FaPen size={15} /></button>
//                       <button onClick={() => handleDelete(user._id)}><FaTrash size={15} /></button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddStaff;







import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaPen, FaTrash } from "react-icons/fa";
import "../css/AddStaff.css";
import { BASE_URL } from "../../config";
import { showSuccess, showError } from "../utils/toastService";

const AddStaff = () => {
  const location = useLocation();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "staff" });
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStaffAndAdmins = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/api/users/my-staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data);
    } catch (error) {
      console.error("Error fetching staff/admins:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Error fetching staff/admins");
      showError(error.response?.data?.message || "Error fetching staff/admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffAndAdmins();
  }, [location.pathname]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    try {
      if (editingUser) {
        const res = await axios.put(
          `${BASE_URL}/api/users/update-user/${editingUser._id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStaff((prev) =>
          prev.map((user) => (user._id === editingUser._id ? res.data.user : user))
        );
        setEditingUser(null);
        showSuccess("User updated successfully!");
      } else {
        const endpoint = form.role === "admin" ? "/add-admin" : "/add-staff";
        const res = await axios.post(`${BASE_URL}/api/users${endpoint}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaff((prev) => [...prev, res.data.staff || res.data.admin]);
        showSuccess(`${form.role === "admin" ? "Admin" : "Staff"} added successfully!`);
      }

      setForm({ username: "", email: "", password: "", role: "staff" });
    } catch (error) {
      console.error("Submit error:", error);
      setError(error.response?.data?.message || "Something went wrong");
      showError(error.response?.data?.message || "Failed to submit form.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/users/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff((prev) => prev.filter((user) => user._id !== id));
      showSuccess("User deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "An error occurred while deleting the user.");
      showError(error.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ username: user.username, email: user.email, password: "", role: user.role });
  };

  const handleCancel = () => {
    setEditingUser(null);
    setForm({ username: "", email: "", password: "", role: "staff" });
    setError("");
  };

  return (
    <div className="admin-register">
      <div className="admin-register-div">
        <h2>{editingUser ? "EDIT USER" : "ADD STAFF"}</h2>
        <form onSubmit={handleSubmit} className="admin-register-form">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <br />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <br />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required={!editingUser}
          />
          <br />
          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="staff">STAFF</option>
            <option value="admin">ADMIN</option>
          </select>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit">{editingUser ? "Update" : "Register"}</button>
            {editingUser && (
              <button
              className="add-product-cancel1"
                type="button"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#ccc",
                  color: "#000",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-table-details">
        <h3>ALL REGISTERED USERS</h3>
        <br />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="add-staff-table-div">
            <table className="add-register-table" border="1">
              <thead>
                <tr className="add-staff-role-head">
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((user) => (
                  <tr key={user._id} className="add-staff-role">
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className="add-buttons">
                      <button onClick={() => handleEdit(user)}>
                        <FaPen size={15} />
                      </button>
                      <button onClick={() => handleDelete(user._id)}>
                        <FaTrash size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStaff;
