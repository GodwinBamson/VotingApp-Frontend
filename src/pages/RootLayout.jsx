import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const RootLayout = () => {
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const navigate = useNavigate();
  //ACCESS CONTROL
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default RootLayout;
