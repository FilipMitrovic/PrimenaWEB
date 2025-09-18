import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Dobrodošli na KvizHub</h1>
      <button className="btn btn-success" onClick={() => navigate("/register")}>Register</button>
      <button className="btn btn-primary" onClick={() => navigate("/login")}>Login</button>
    </div>
  );
};

export default Home;
