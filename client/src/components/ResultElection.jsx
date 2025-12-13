import { useEffect, useState } from "react";
import CandidateRating from "./CandidateRating";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import { BASE_URL } from "../config"; // Import BASE_URL

const ResultElection = ({ _id: id, thumbnail, title }) => {
  const [totalVotes, setTotalVotes] = useState(0);
  const [electionCandidates, setElectionCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state?.vote?.currentVoter?.token);

  const getCandidates = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/elections/${id}/candidates`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const candidates = response.data;
      setElectionCandidates(candidates);

      // calculate the total votes in each election
      const total = candidates.reduce(
        (acc, candidate) => acc + candidate.voteCount,
        0
      );
      setTotalVotes(total);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCandidates();
  }, [id]);

  return (
    <>
      {isLoading && <Loader />}
      <article className="result">
        <header className="result_header">
          <h4>{title}</h4>
          <div className="result_header-image">
            {/*  Correct Thumbnail */}
            <img src={thumbnail} alt={title} />
          </div>
        </header>

        <ul className="result_list">
          {electionCandidates.map((candidate) => (
            <CandidateRating
              key={candidate._id}
              {...candidate}
              totalVotes={totalVotes}
            />
          ))}
        </ul>

        <Link to={`/elections/${id}/candidates`} className="btn primary full">
          Enter Election
        </Link>
      </article>
    </>
  );
};

export default ResultElection;
