import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Dobrodošli na KvizHub</h1>
      <button onClick={() => navigate("/register")} style={{ margin: "10px", padding: "10px 20px" }}>
        Register
      </button>
      <button onClick={() => navigate("/login")} style={{ margin: "10px", padding: "10px 20px" }}>
        Login
      </button>
    </div>
  );
};

export default Home;
