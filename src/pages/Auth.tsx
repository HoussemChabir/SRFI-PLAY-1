import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Auth page removed — redirect users to home
const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect to home since auth was removed
    navigate("/");
  }, [navigate]);

  return null;
};

export default Auth;
