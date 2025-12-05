import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { UIActions } from "../store/ui-slice";
import { useNavigate } from "react-router-dom";

const UpdateElectionModal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const dispatch = useDispatch();

  const idOfElectionToUpdate = useSelector(
    (state) => state?.vote?.idOfElectionToUpdate
  );

  const token = useSelector((state) => state?.vote?.currentVoter?.token);

  const navigate = useNavigate();

  //Close update election modal

  const closeModal = () => {
    dispatch(UIActions.closeUpdateElectionModal());
  };

  const fetchElection = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/elections/${idOfElectionToUpdate}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const election = response.data;
      setTitle(election.title);
      setDescription(election.description);
      setThumbnail(election.thumbnail);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchElection();
  }, []);

  const updateElection = async (e) => {
    e.preventDefault();
    try {
      const electionData = new FormData();
      electionData.set("title", title);
      electionData.set("description", description);
      electionData.set("thumbnail", thumbnail);

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/elections/${idOfElectionToUpdate}`,
        electionData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // alert("Election updated successfully");
      closeModal();
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="modal">
      <div className="modal_content">
        <header className="modal_header">
          <h4>Edit Election</h4>
          <button className="modal_close" onClick={closeModal}>
            <IoMdClose />
          </button>
        </header>
        <form onSubmit={updateElection}>
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
            Update Election
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdateElectionModal;
