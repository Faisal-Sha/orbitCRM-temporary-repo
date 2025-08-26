
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the personal dashboard page which is our main dashboard
    navigate("/personal");
  }, [navigate]);

  return null; // This component doesn't render anything, it just redirects
};

export default Index;
