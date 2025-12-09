// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { UIActions } from "../store/ui-slice";
// import { voteActions } from "../store/vote-slice";

// const Election = ({ _id, title, description, thumbnail }) => {
//   const dispatch = useDispatch();

//   const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);
//   // Open Update Election Modal
//   const openModal = () => {
//     dispatch(UIActions.openUpdateElectionModal());
//     dispatch(voteActions.changeIdOfElectionToUpdate(_id));
//   };

//   return (
//     <article className="election">
//       <div className="election_image">
//         <img src={thumbnail} alt={title} />
//       </div>
//       <div className="election_info">
//         <Link to={`/elections/${_id}`}>
//           <h4>{title}</h4>
//         </Link>
//         <p>
//           {description?.length > 255
//             ? description.substring(0, 255) + "..."
//             : description}
//         </p>
//         <div className="election_cta">
//           <Link to={`/elections/${_id}`} className="btn sm">
//             View
//           </Link>
//           {isAdmin && (
//             <button className="btn sm primary" onClick={openModal}>
//               Edit
//             </button>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// };

// export default Election;



// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { UIActions } from "../store/ui-slice";
// import { voteActions } from "../store/vote-slice";
// import { BASE_URL } from "../config"; // Import BASE_URL

// const Election = ({ _id, title, description, thumbnail }) => {
//   const dispatch = useDispatch();

//   const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);

//   // Open Update Election Modal
//   const openModal = () => {
//     dispatch(UIActions.openUpdateElectionModal());
//     dispatch(voteActions.changeIdOfElectionToUpdate(_id));
//   };

//   return (
//     <article className="election">
//       <div className="election_image">
//         {/* Use BASE_URL to load image from backend */}
//         <img src={`${BASE_URL}/${thumbnail}`} alt={title} />
//       </div>
//       <div className="election_info">
//         <Link to={`/elections/${_id}`}>
//           <h4>{title}</h4>
//         </Link>
//         <p>
//           {description?.length > 255
//             ? description.substring(0, 255) + "..."
//             : description}
//         </p>
//         <div className="election_cta">
//           <Link to={`/elections/${_id}`} className="btn sm">
//             View
//           </Link>
//           {isAdmin && (
//             <button className="btn sm primary" onClick={openModal}>
//               Edit
//             </button>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// };

// export default Election;


import { useDispatch, useSelector } from "react-redux";
import { UIActions } from "../store/ui-slice";
import { voteActions } from "../store/vote-slice";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config";

const Election = ({ _id, title, description, thumbnail }) => {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);

  const openModal = () => {
    dispatch(UIActions.openUpdateElectionModal());
    dispatch(voteActions.changeIdOfElectionToUpdate(_id));
  };

  return (
    <article className="election">
      <div className="election_image">
        <img src={thumbnail.startsWith("http") ? thumbnail : `${BASE_URL}/${thumbnail}`} alt={title} />
      </div>
      <div className="election_info">
        <Link to={`/elections/${_id}`}>
          <h4>{title}</h4>
        </Link>
        <p>{description?.length > 255 ? description.substring(0, 255) + "..." : description}</p>
        <div className="election_cta">
          <Link to={`/elections/${_id}`} className="btn sm">View</Link>
          {isAdmin && <button className="btn sm primary" onClick={openModal}>Edit</button>}
        </div>
      </div>
    </article>
  );
};

export default Election;

