// import { useEffect, useState } from "react";
// import Election from "../components/Election";
// import AddElectionModal from "../components/AddElectionModal";
// import { useDispatch, useSelector } from "react-redux";
// import { UIActions } from "../store/ui-slice";
// import UpdateElectionModal from "../components/UpdateElectionModal";
// import axios from "axios";
// import Loader from "../components/Loader";
// import { useNavigate } from "react-router-dom";

// const Elections = () => {
//   const token = useSelector((state) => state?.vote?.currentVoter?.token);
//   const navigate = useNavigate();
//   //ACCESS CONTROL
//   useEffect(() => {
//     if (!token) {
//       navigate("/");
//     }
//   }, []);

//   const [elections, setElections] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const dispatch = useDispatch();

//   // Open add election modal
//   const openModal = () => {
//     dispatch(UIActions.openElectionModal());
//   };

//   const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);

//   const electionModalShowing = useSelector(
//     (state) => state.ui.electionModalShowing
//   );
//   const updateElectionModalShowing = useSelector(
//     (state) => state.ui.updateElectionModalShowing
//   );

//   const getElections = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         // `${import.meta.env.VITE_API_URL}/api/elections`,
//         `${import.meta.env.VITE_API_URL}/elections`,
//         {
//           withCredentials: true,
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setElections(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     getElections();
//   }, []);

//   return (
//     <>
//       <section className="elections">
//         <div className="container elections_container">
//           <header className="elections_header">
//             <h1>Ongoing Elections</h1>
//             {isAdmin && (
//               <button className="btn primary" onClick={openModal}>
//                 Create new Election
//               </button>
//             )}
//           </header>

//           {isLoading ? (
//             <Loader />
//           ) : (
//             <menu className="elections_menu">
//               {elections.map((election) => (
//                 <Election key={election._id} {...election} />
//               ))}
//             </menu>
//           )}
//         </div>
//       </section>

//       {electionModalShowing && <AddElectionModal />}
//       {updateElectionModalShowing && <UpdateElectionModal />}
//     </>
//   );
// };

// export default Elections;



import { useEffect, useState } from "react";
import Election from "../components/Election";
import AddElectionModal from "../components/AddElectionModal";
import { useDispatch, useSelector } from "react-redux";
import { UIActions } from "../store/ui-slice";
import UpdateElectionModal from "../components/UpdateElectionModal";
import axios from "axios";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config"; // ✅ import BASE_URL

const Elections = () => {
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const navigate = useNavigate();

  // ACCESS CONTROL
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // Open add election modal
  const openModal = () => {
    dispatch(UIActions.openElectionModal());
  };

  const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);

  const electionModalShowing = useSelector(
    (state) => state.ui.electionModalShowing
  );
  const updateElectionModalShowing = useSelector(
    (state) => state.ui.updateElectionModalShowing
  );

  const getElections = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/elections`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setElections(response.data);
    } catch (error) {
      console.log("Failed to fetch elections:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getElections();
  }, []);

  return (
    <>
      <section className="elections">
        <div className="container elections_container">
          <header className="elections_header">
            <h1>Ongoing Elections</h1>
            {isAdmin && (
              <button className="btn primary" onClick={openModal}>
                Create new Election
              </button>
            )}
          </header>

          {isLoading ? (
            <Loader />
          ) : (
            <menu className="elections_menu">
              {elections.map((election) => (
                <Election key={election._id} {...election} />
              ))}
            </menu>
          )}
        </div>
      </section>

      {electionModalShowing && <AddElectionModal />}
      {updateElectionModalShowing && <UpdateElectionModal />}
    </>
  );
};

export default Elections;
