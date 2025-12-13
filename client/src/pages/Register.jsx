import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config"; // import BASE_URL

const Register = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const registerVoter = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}/voters/register`, // using BASE_URL
        userData,
        { withCredentials: true } // optional, if you need cookies
      );
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="register">
      <div className="container register_container">
        <h2>Sign Up</h2>
        <form onSubmit={registerVoter}>
          {error && <p className="form_error-message">{error}</p>}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={changeInputHandler}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={changeInputHandler}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={changeInputHandler}
            required
          />
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            onChange={changeInputHandler}
            required
          />
          <p>
            Already have an account? <Link to="/">Sign in</Link>
          </p>
          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
