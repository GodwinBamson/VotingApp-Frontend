// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { voteActions } from "../store/vote-slice";

// const Login = () => {
//   const [userData, setUserData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     password2: "",
//   });

//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   //Function to change controlled inputs
//   const changeInputHandler = (e) => {
//     setUserData((prevState) => {
//       return { ...prevState, [e.target.name]: e.target.value };
//     });
//   };

//   const loginVoter = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         // `${import.meta.env.VITE_API_URL}/api/voters/login`,
//         `${import.meta.env.VITE_API_URL}/voters/login`,
//         userData
//       );
//       const newVoter = await response.data; //payload
//       // save new voter in local storage and update in redux store
//       localStorage.setItem("currentUser", JSON.stringify(newVoter));
//       dispatch(voteActions.changeCurrentVoter(newVoter));
//       navigate("/results");
//     } catch (err) {
//       setError(err.response.data.message);
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


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { voteActions } from "../store/vote-slice";
import { BASE_URL } from "../config"; // ✅ import BASE_URL

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Controlled input handler
  const changeInputHandler = (e) => {
    setUserData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };



  const loginVoter = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `${BASE_URL}/voters/login`, // ✅ no extra /api
      userData,
      { withCredentials: true }
    );

    const newVoter = response.data;
    localStorage.setItem("currentUser", JSON.stringify(newVoter));
    dispatch(voteActions.changeCurrentVoter(newVoter));
    navigate("/results");
  } catch (err) {
    console.log(err.response); // check the real backend error
    setError(err.response?.data?.message || "Login failed");
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
            onChange={changeInputHandler}
            autoComplete="true"
            autoFocus
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={changeInputHandler}
            autoComplete="true"
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
