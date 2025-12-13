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
//   );
// };

// export default Login;




import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { voteActions } from "../store/vote-slice";
import { BASE_URL } from "../config";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔍 Debug: Verify environment
  useEffect(() => {
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
    console.log("BASE_URL:", BASE_URL);

    if (!BASE_URL) {
      setError(
        "API configuration missing. Frontend not configured for deployment."
      );
    }
  }, []);

  const changeInputHandler = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const loginVoter = async (e) => {
    e.preventDefault();
    setError("");

    if (!BASE_URL) {
      setError("API URL is missing. Deployment not configured correctly.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/voters/login`,
        userData,
        { withCredentials: true } // include cookies if needed
      );

      const newVoter = response.data;

      // Save voter in localStorage and Redux
      localStorage.setItem("currentUser", JSON.stringify(newVoter));
      dispatch(voteActions.changeCurrentVoter(newVoter));

      // Navigate to results page
      navigate("/results");
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (err.response) {
        setError(err.response.data?.message || "Login failed");
      } else if (err.request) {
        setError(
          "Cannot reach server. Check backend is running or network status."
        );
      } else {
        setError("Unexpected error occurred during login.");
      }
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
            required
            autoFocus
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={changeInputHandler}
            required
          />

          <p>
            Do not have an account? <Link to="/register">Sign up</Link>
          </p>

          <button type="submit" className="btn primary">
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
