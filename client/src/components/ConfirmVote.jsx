import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UIActions } from "../store/ui-slice";
import axios from "axios";
import { voteActions } from "../store/vote-slice";
import { useNavigate } from "react-router-dom";

const ConfirmVote = ({ selectedElection }) => {
  const [modalCandidate, setModalCandidate] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeCandidateModal = () => {
    dispatch(UIActions.closeVoteCandidateModal());
  };

  const selectedVoteCandidate = useSelector(
    (state) => state.vote.selectedVoteCandidate
  );
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const currentvoter = useSelector((state) => state?.vote?.currentVoter);

  const fetchCandidate = async () => {
    try {
      const response = await axios.get(
        // `${import.meta.env.VITE_API_URL}/api/candidates/${selectedVoteCandidate}`,

        `${import.meta.env.VITE_API_URL}/candidates/${selectedVoteCandidate}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModalCandidate(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmVote = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/candidates/${selectedVoteCandidate}`,
        { selectedElection },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Go to congrats page first
      navigate("/congrats");

      // Refresh after a short delay (so navigation works)
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [selectedVoteCandidate]);

  return (
    <section className="modal">
      <div className="modal_content confirm_vote-content">
        <h5>Please confirm your vote</h5>
        <div className="confirm_vote-image">
          <img src={modalCandidate.image} alt={modalCandidate.fullName} />
        </div>
        <h2>
          {modalCandidate?.fullName?.length > 17
            ? modalCandidate?.fullName?.substring(0, 17) + "..."
            : modalCandidate?.fullName}
        </h2>
        <p>
          {modalCandidate?.motto?.length > 45
            ? modalCandidate?.motto?.substring(0, 45) + "..."
            : modalCandidate?.motto}
        </p>
        <div className="confirm_vote-cta">
          <button className="btn" onClick={closeCandidateModal}>
            Cancel
          </button>
          <button className="btn primary" onClick={confirmVote}>
            Confirm
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmVote;
