


import { useState, useEffect } from "react";
import axios from "axios";
import { FaPen, FaTrash } from "react-icons/fa";
import "../css/AdminRegister.css";
import { BASE_URL } from "../../config";
import { showSuccess, showError } from "../utils/toastService";

const AdminRegister = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "staff" });
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to handle the loading screen

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || !role) {
        showError("No token or role found");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/api/users/my-staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const visibleUsers =
          role === "admin" ? res.data.filter((user) => user.role === "staff") : res.data;

        setStaff(visibleUsers);
      } catch (error) {
        const message = error.response?.data?.message || "Error fetching staff";
        showError(message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

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
        setStaff(staff.map((user) => (user._id === editingUser._id ? res.data.user : user)));
        setEditingUser(null);
        showSuccess("User updated successfully!");
      } else {
        const endpoint = form.role === "admin" ? "/add-admin" : "/add-staff";
        const res = await axios.post(`${BASE_URL}/api/users${endpoint}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaff([...staff, res.data.staff || res.data.admin]);
        showSuccess(`${form.role.toUpperCase()} created successfully!`);
      }

      setForm({ username: "", email: "", password: "", role: "staff" });
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setError(message);
      showError(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/users/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(staff.filter((user) => user._id !== id));
      showSuccess("User deleted successfully!");
    } catch (error) {
      const message = error.response?.data?.message || "An error occurred while deleting the user.";
      setError(message);
      showError(message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ username: user.username, email: user.email, password: "", role: user.role });
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
          <button type="submit">{editingUser ? "Update" : "Register"}</button>
        </form>
      </div>

      <div className="admin-table-details">
        <h3>ALL REGISTERED USERS</h3>
        <br />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="admin-register-table" border="1">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}><FaPen size={15} /></button>
                    <button onClick={() => handleDelete(user._id)}><FaTrash size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminRegister;
