import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { UIActions } from "../store/ui-slice";
import AddCandidateModal from "../components/AddCandidateModal";
import axios from "axios";
import Loader from "../components/Loader";
import { voteActions } from "../store/vote-slice";
import ElectionCandidate from "../components/ElectionCandidate";

const ElectionDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);
  const addCandidateModalShowing = useSelector(
    (state) => state.ui.addCandidateModalShowing
  );

  const { id } = useParams();

  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const getElection = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/elections/${id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setElections(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getCandidates = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/elections/${id}/candidates`,
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

  const getVoters = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/elections/${id}/voters`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVoters(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteElection = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/elections/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/elections");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getElection();
    getCandidates();
    getVoters();
  }, [id]);

  const openModal = () => {
    dispatch(UIActions.openAddCandidateModal());
    dispatch(voteActions.changeAddCandidateElectionId(id));
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <section className="electionDetails">
        <div className="container electionDetails_container">
          <h2>{elections.title}</h2>
          <p>{elections.description}</p>
          <div className="electionDetails_image">
            <img src={elections.thumbnail} alt={elections.title} />
          </div>

          <menu className="electionDetails_candidates">
            {candidates.map((candidate) => (
              <ElectionCandidate key={candidate._id} {...candidate} />
            ))}

            {isAdmin && (
              <button className="add_candidate-btn" onClick={openModal}>
                <IoAddOutline />
              </button>
            )}
          </menu>

          <menu className="voters">
            <br />
            <h2>Voters</h2>
            <br />
            <table className="voters_table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {voters.map((voter) => (
                  <tr key={voter._id}>
                    <td>
                      <h5>{voter.fullName}</h5>
                    </td>
                    <td>
                      <h5>{voter.email}</h5>
                    </td>
                    <td>
                      <h5>{voter.createdAt}</h5>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </menu>

          {isAdmin && (
            <button className="btn danger full" onClick={deleteElection}>
              Delete Election
            </button>
          )}
        </div>
      </section>
      {addCandidateModalShowing && <AddCandidateModal />}
    </>
  );
};

export default ElectionDetails;
