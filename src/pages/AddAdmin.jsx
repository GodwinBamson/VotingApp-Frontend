

import { useState, useEffect } from "react";
import axios from "axios";
import { FaPen, FaTrash } from "react-icons/fa";
import "../css/AddAdmin.css";
import { BASE_URL } from "../../config";
import { showSuccess, showError } from "../utils/toastService";

const AddAdmin = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "staff" });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        setCurrentUser(user);

        if (!user || user.role === "staff") return;

        const res = await axios.get(`${BASE_URL}/api/users/staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data || []);
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
        showError(error.response?.data?.message || "Failed to fetch users.");
      }
    };

    fetchUsers();
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

        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === editingUser._id ? res.data.user : user))
        );

        setEditingUser(null);
        showSuccess("User updated successfully!");
      } else {
        const endpoint = form.role === "admin" ? "/add-admin" : "/add-staff";

        const res = await axios.post(`${BASE_URL}/api/users${endpoint}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const newUser = res.data.staff || res.data.admin;
        setUsers((prevUsers) => [...prevUsers, newUser]);
        showSuccess("User created successfully!");
      }

      setForm({ username: "", email: "", password: "", role: "staff" });
    } catch (error) {
      console.error("Submit error:", error);
      const msg = error.response?.data?.message || "Something went wrong";
      setError(msg);
      showError(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/users/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      showSuccess("User deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      const msg = error.response?.data?.message || "An error occurred while deleting the user.";
      setError(msg);
      showError(msg);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ username: user.username, email: user.email, password: "", role: user.role });
  };

  const getTitle = () => {
    if (currentUser?.role === "superadmin") return "ALL ADMINS AND STAFF";
    if (currentUser?.role === "admin") return "YOUR REGISTERED STAFF";
    return "";
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

  return (
    <div className="admin-register">
      <div className="admin-register-div">
        <h2>
          {editingUser
            ? "EDIT USER"
            : currentUser?.role === "superadmin"
            ? "ADD ADMIN OR STAFF"
            : "ADD STAFF"}
        </h2>
        <form onSubmit={handleSubmit} className="admin-register-form">
          <input
            type="text"
            placeholder="Search users by username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            disabled={currentUser?.role !== "superadmin"}
          >
            <option value="staff">STAFF</option>
            <option value="admin">ADMIN</option>
          </select>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">{editingUser ? "Update" : "Register"}</button>
        </form>
      </div>

      <div className="admin-table-details">
        <h3>{getTitle()}</h3>
        <br />
        <table className="admin-register-table" border="1">
          <thead>
            <tr className="super-admin-head">
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="add-product-body">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr className="add-column" key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEdit(user)}>
                      <FaPen size={15} />
                    </button>
                    <button onClick={() => handleDelete(user._id)}>
                      <FaTrash size={15} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No users found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button
            className="add-product-next-admin"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            &laquo; Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`add-product-none ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="add-product-next-admin"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;