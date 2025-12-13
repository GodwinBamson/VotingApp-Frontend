import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UIActions } from "../store/ui-slice";
import { voteActions } from "../store/vote-slice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config"; // import BASE_URL

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

  const fetchCandidate = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/candidates/${selectedVoteCandidate}`, // use BASE_URL
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModalCandidate(response.data);
    } catch (error) {
      console.log("Fetch candidate error:", error);
    }
  };

  const confirmVote = async () => {
    try {
      await axios.patch(
        `${BASE_URL}/candidates/${selectedVoteCandidate}`, // use BASE_URL
        { selectedElection },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Navigate to congrats page first
      navigate("/congrats");

      // Optional refresh after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log("Confirm vote error:", error);
    }
  };

  useEffect(() => {
    if (selectedVoteCandidate) {
      fetchCandidate();
    }
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
            ? modalCandidate.fullName.substring(0, 17) + "..."
            : modalCandidate.fullName}
        </h2>
        <p>
          {modalCandidate?.motto?.length > 45
            ? modalCandidate.motto.substring(0, 45) + "..."
            : modalCandidate.motto}
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
