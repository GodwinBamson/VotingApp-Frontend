// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Candidate from "../components/Candidate";
// import ConfirmVote from "../components/ConfirmVote";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Candidates = () => {
//   const token = useSelector((state) => state?.vote?.currentVoter?.token);
//   const navigate = useNavigate();
//   //ACCESS CONTROL
//   useEffect(() => {
//     if (!token) {
//       navigate("/");
//     }
//   }, []);

//   const { id: selectedElection } = useParams();
//   const [candidates, setCandidates] = useState([]);
//   const [canVote, setCanVote] = useState(true);

//   const voteCandidateModalShowing = useSelector(
//     (state) => state.ui.voteCandidateModalShowing
//   );

//   const voterId = useSelector((state) => state?.vote?.currentVoter?.id);

//   const voterElections = useSelector(
//     (state) => state?.vote?.currentVoter?.votedElections
//   );

//   const getCandidates = async () => {
//     try {
//       const response = await axios.get(
//         `${
//           import.meta.env.VITE_API_URL
//         }/elections/${selectedElection}/candidates`,
//         {
//           withCredentials: true,
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setCandidates(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // check if voter has already voted
//   const getVoter = async () => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/voters/${voterId}`,
//         {
//           withCredentials: true,
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const votedElections = response.data.votedElections || [];
//       if (votedElections.includes(selectedElection)) {
//         setCanVote(false);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getCandidates();
//     getVoter();

//     if (
//       Array.isArray(voterElections) &&
//       voterElections.includes(selectedElection)
//     ) {
//       setCanVote(false);
//     }
//   }, [selectedElection]);

//   return (
//     <>
//       <section className="candidates">
//         {!canVote ? (
//           <header className="candidates_header">
//             <h1>Already voted</h1>
//             <p>
//               You are only permitted to vote once in this election. Please vote
//               in another election or sign out.
//             </p>
//           </header>
//         ) : (
//           <>
//             {candidates.length === 0 ? (
//               <header className="candidates_header">
//                 <h1>Inactive Election</h1>
//                 <p>
//                   There are no candidates found for this election. Please check
//                   back later.
//                 </p>
//               </header>
//             ) : (
//               <div className="container candidates_container">
//                 {candidates.map((candidate) => (
//                   <Candidate key={candidate._id} {...candidate} />
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </section>
//       {voteCandidateModalShowing && (
//         <ConfirmVote selectedElection={selectedElection} />
//       )}
//     </>
//   );
// };

// export default Candidates;



import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Candidate from "../components/Candidate";
import ConfirmVote from "../components/ConfirmVote";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Candidates = () => {
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const navigate = useNavigate();
  //ACCESS CONTROL
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  const { id: selectedElection } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [canVote, setCanVote] = useState(true);

  const voteCandidateModalShowing = useSelector(
    (state) => state.ui.voteCandidateModalShowing
  );

  const voterId = useSelector((state) => state?.vote?.currentVoter?.id);

  const voterElections = useSelector(
    (state) => state?.vote?.currentVoter?.votedElections
  );

  const getCandidates = async () => {
    try {
      const response = await axios.get(
        // `${import.meta.env.VITE_API_URL}/api/elections/${selectedElection}/candidates`,

        `${import.meta.env.VITE_API_URL}/elections/${selectedElection}/candidates`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCandidates(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // check if voter has already voted
  const getVoter = async () => {
    try {
      const response = await axios.get(
        // `${import.meta.env.VITE_API_URL}/api/voters/${voterId}`,

        `${import.meta.env.VITE_API_URL}/voters/${voterId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const votedElections = response.data.votedElections || [];
      if (votedElections.includes(selectedElection)) {
        setCanVote(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCandidates();
    getVoter();

    if (
      Array.isArray(voterElections) &&
      voterElections.includes(selectedElection)
    ) {
      setCanVote(false);
    }
  }, [selectedElection]);

  return (
    <>
      <section className="candidates">
        {!canVote ? (
          <header className="candidates_header">
            <h1>Already voted</h1>
            <p>
              You are only permitted to vote once in this election. Please vote
              in another election or sign out.
            </p>
          </header>
        ) : (
          <>
            {candidates.length === 0 ? (
              <header className="candidates_header">
                <h1>Inactive Election</h1>
                <p>
                  There are no candidates found for this election. Please check
                  back later.
                </p>
              </header>
            ) : (
              <div className="container candidates_container">
                {candidates.map((candidate) => (
                  <Candidate key={candidate._id} {...candidate} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
      {voteCandidateModalShowing && (
        <ConfirmVote selectedElection={selectedElection} />
      )}
    </>
  );
};

export default Candidates;
