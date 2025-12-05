// src/components/Loader.jsx
import Spinner from "../assets/spinner-of-dots.png";

const Loader = () => {
  return (
    <section className="loader">
      <div className="loader_container">
        <img src={Spinner} alt="Loading..." />
      </div>
    </section>
  );
};

export default Loader;
