import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { UIActions } from "../store/ui-slice";
import { useNavigate } from "react-router-dom";

const AddElectionModal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state?.vote?.currentVoter?.token);

  const createElection = async (e) => {
    try {
      e.preventDefault();
      const electionData = new FormData();
      electionData.set("title", title);
      electionData.set("description", description);
      electionData.set("thumbnail", thumbnail);

      await axios.post(
        // `${import.meta.env.VITE_API_URL}/api/elections`,

        `${import.meta.env.VITE_API_URL}/elections`,
        electionData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // alert("Election added successfully");
      closeModal();
      navigate(0);
    } catch (error) {
      console.log(error);
      alert("Failed to add election");
    }
  };

  const closeModal = () => {
    dispatch(UIActions.closeElectionModal());
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
            />
          </div>
          <div>
            <h6>Election Description:</h6>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              name="description"
            />
          </div>
          <div>
            <h6>Election Thumbnail:</h6>
            <input
              type="file"
              onChange={(e) => setThumbnail(e.target.files[0])}
              accept=".png, .jpg, .jpeg, .webp, .avif"
              name="thumbnail"
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
