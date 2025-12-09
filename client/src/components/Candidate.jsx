// import { useDispatch } from "react-redux";
// import { UIActions } from "../store/ui-slice";
// import { voteActions } from "../store/vote-slice";

// const Candidate = ({ image, _id: id, fullName, motto }) => {
//   const dispatch = useDispatch();

//   const openCandidateModal = () => {
//     dispatch(voteActions.changeSelectedVoteCandidate(id));
//     dispatch(UIActions.openVoteCandidateModal());
//   };

//   return (
//     <article className="candidate">
//       <div className="candidate_image">
//         <img src={image} alt={fullName} />
//       </div>

//       <h5>
//         {fullName?.length > 20 ? fullName.substring(0, 20) + "..." : fullName}
//       </h5>

//       <small>
//         {motto?.length > 25 ? motto.substring(0, 25) + "..." : motto}
//       </small>

//       <button className="btn primary" onClick={openCandidateModal}>
//         Vote
//       </button>
//     </article>
//   );
// };

// export default Candidate;



import { useDispatch } from "react-redux";
import { UIActions } from "../store/ui-slice";
import { voteActions } from "../store/vote-slice";

const Candidate = ({ image, _id: id, fullName, motto }) => {
  const dispatch = useDispatch();

  const openCandidateModal = () => {
    dispatch(voteActions.changeSelectedVoteCandidate(id));
    dispatch(UIActions.openVoteCandidateModal());
  };

  return (
    <article className="candidate">
      <div className="candidate_image">
        <img src={image.startsWith("http") ? image : `${BASE_URL}/${image}`} alt={fullName} />
      </div>
      <h5>{fullName?.length > 20 ? fullName.substring(0, 20) + "..." : fullName}</h5>
      <small>{motto?.length > 25 ? motto.substring(0, 25) + "..." : motto}</small>
      <button className="btn primary" onClick={openCandidateModal}>Vote</button>
    </article>
  );
};

export default Candidate;
