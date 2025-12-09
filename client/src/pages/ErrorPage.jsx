import { useEffect } from "react";
import Image from "../assets/error.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ErrorPage = () => {
  const token = useSelector((state) => state?.vote?.currentVoter?.token);

  //ACCESS CONTROL
  useEffect(() => {
    if (!token) {
      navigator("/");
    }
  }, []);

  const navigate = useNavigate();

  // redirect user to previous page after 6 seconds
  useEffect(() => {
    setTimeout(() => {
      navigate(-1);
    }, 6000);
  });
  return (
    <section className="errorPage">
      <div className="errorPage_container">
        <img src={Image} alt="Page not found." />
        <h1>404</h1>
        <p>
          This page does not exist. You will be redirect to the previous page
          shortly.
        </p>
      </div>
    </section>
  );
};

export default ErrorPage;
