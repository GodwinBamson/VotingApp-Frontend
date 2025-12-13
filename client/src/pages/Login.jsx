// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { voteActions } from "../store/vote-slice";
// import { BASE_URL } from "../config"; // import BASE_URL

// const Login = () => {
//   const [userData, setUserData] = useState({
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Controlled input handler
//   const changeInputHandler = (e) => {
//     setUserData((prevState) => ({
//       ...prevState,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const loginVoter = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${BASE_URL}/voters/login`, userData);
//       const newVoter = response.data;

//       // Save voter in local storage and Redux store
//       localStorage.setItem("currentUser", JSON.stringify(newVoter));
//       dispatch(voteActions.changeCurrentVoter(newVoter));

//       navigate("/results");
//     } catch (err) {
//       console.log(err.response); // Debug backend errors
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <section className="register">
//       <div className="container register_container">
//         <h2>Sign In</h2>
//         <form onSubmit={loginVoter}>
//           {error && <p className="form_error-message">{error}</p>}

//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             onChange={changeInputHandler}
//             autoComplete="true"
//             autoFocus
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             onChange={changeInputHandler}
//             autoComplete="true"
//           />

//           <p>
//             Do not have an account? <Link to="/register">Sign up</Link>
//           </p>
//           <button type="submit" className="btn primary">
//             Login
//           </button>
//         </form>
//       </div>
//     </section>
//     );
//   };

//   export default Login;



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { voteActions } from "../store/vote-slice";
import { BASE_URL } from "../config";

const Login = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeInputHandler = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const loginVoter = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/voters/login`, userData, {
        withCredentials: true,
      });

      const voter = res.data;
      localStorage.setItem("currentUser", JSON.stringify(voter));
      dispatch(voteActions.changeCurrentVoter(voter));
      navigate("/results");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register">
      <div className="container register_container">
        <h2>Sign In</h2>
        <form onSubmit={loginVoter}>
          {error && <p className="form_error-message">{error}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={userData.email}
            onChange={changeInputHandler}
            autoComplete="email"
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={changeInputHandler}
            autoComplete="current-password"
            required
            disabled={loading}
          />

          <p>
            Do not have an account? <Link to="/register">Sign up</Link>
          </p>
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;


