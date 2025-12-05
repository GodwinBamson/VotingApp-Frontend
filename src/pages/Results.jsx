import { useEffect, useState } from "react";
import ResultElection from "../components/ResultElection";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const navigate = useNavigate();
  //ACCESS CONTROL
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  const [elections, setElections] = useState([]);

  const getElections = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/elections`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setElections(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getElections();
  }, []);

  return (
    <section className="results">
      <div className="container results_container">
        {console.log("Elections state:", elections)}
        {elections.length === 0 ? (
          <p>No elections found.</p>
        ) : (
          elections.map((election) => (
            <ResultElection key={election._id} {...election} />
          ))
        )}
      </div>
    </section>
  );
};

export default Results;
