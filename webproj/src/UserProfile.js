import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");
  const image = localStorage.getItem("userImage");

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      {image && <img src={image} alt="UserProfile" style={{ width: "150px", borderRadius: "50%" }} />}
      <br /><br />
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default UserProfile;
