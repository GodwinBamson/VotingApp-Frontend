import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UIActions } from "../store/ui-slice";
import { BASE_URL } from "../config"; // import BASE_URL

const AddCandidateModal = () => {
  const [fullName, setFullName] = useState("");
  const [motto, setMotto] = useState("");
  const [image, setImage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const electionId = useSelector(
    (state) => state?.vote?.addCandidateElectionId
  );

  const closeModal = () => {
    dispatch(UIActions.closeAddCandidateModal());
  };

  const addCandidate = async (e) => {
    e.preventDefault();
    try {
      const candidateInfo = new FormData();
      candidateInfo.set("fullName", fullName);
      candidateInfo.set("motto", motto);
      candidateInfo.set("image", image);
      candidateInfo.set("currentElection", electionId);

      await axios.post(`${BASE_URL}/candidates`, candidateInfo, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      closeModal();
      navigate(0); // refresh page
    } catch (error) {
      console.log("Add candidate error:", error);
    }
  };

  return (
    <section className="modal">
      <div className="modal_content">
        <header className="modal_header">
          <h4>Add Candidate</h4>
          <button className="modal_close" onClick={closeModal}>
            <IoMdClose />
          </button>
        </header>
        <form onSubmit={addCandidate}>
          <div>
            <h6>Candidate Name:</h6>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <h6>Candidate Motto:</h6>
            <input
              type="text"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              required
            />
          </div>
          <div>
            <h6>Candidate Image:</h6>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/png, image/jpg, image/jpeg, image/webp, image/avif"
              required
            />
          </div>
          <button type="submit" className="btn primary">
            Add Candidate
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddCandidateModal;
