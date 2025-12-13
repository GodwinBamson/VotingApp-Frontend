import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { UIActions } from "../store/ui-slice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config"; // import BASE_URL

const AddElectionModal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state?.vote?.currentVoter?.token);

  const closeModal = () => {
    dispatch(UIActions.closeElectionModal());
  };

  const createElection = async (e) => {
    e.preventDefault();
    try {
      const electionData = new FormData();
      electionData.set("title", title);
      electionData.set("description", description);
      electionData.set("thumbnail", thumbnail);

      await axios.post(`${BASE_URL}/elections`, electionData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      closeModal();
      navigate(0); // refresh page to show new election
    } catch (error) {
      console.log("Create election error:", error);
      alert("Failed to add election");
    }
  };

  return (
    <section className="modal">
      <div className="modal_content">
        <header className="modal_header">
          <h4>Create New Election</h4>
          <button className="modal_close" onClick={closeModal}>
            <IoMdClose />
          </button>
        </header>
        <form onSubmit={createElection}>
          <div>
            <h6>Election Title:</h6>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              required
            />
          </div>
          <div>
            <h6>Election Description:</h6>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              name="description"
              required
            />
          </div>
          <div>
            <h6>Election Thumbnail:</h6>
            <input
              type="file"
              onChange={(e) => setThumbnail(e.target.files[0])}
              accept=".png, .jpg, .jpeg, .webp, .avif"
              name="thumbnail"
              required
            />
          </div>
          <button type="submit" className="btn primary">
            Add Election
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddElectionModal;
