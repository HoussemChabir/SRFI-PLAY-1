import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Authentication screens removed — redirect to home
    navigate("/");
  }, [navigate]);

  return null;
};

export default Auth;
