import { useEffect, useState } from "react";
import ResultElection from "../components/ResultElection";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config"; // import BASE_URL

const Results = () => {
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const navigate = useNavigate();

  //ACCESS CONTROL
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const [elections, setElections] = useState([]);

  const getElections = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/elections`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setElections(response.data);
    } catch (error) {
      console.log("Failed to fetch elections:", error);
    }
  };

  useEffect(() => {
    getElections();
  }, []);

  return (
    <section className="results">
      <div className="container results_container">
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
