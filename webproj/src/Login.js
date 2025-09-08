import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./services/userService";
import { LoginDTO } from "./models/LoginDTO";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginDto = new LoginDTO(formData.name, formData.password);
      const res = await loginUser(loginDto);

      localStorage.setItem("token", res.data.token || "");
      localStorage.setItem("userName", formData.name);
      localStorage.setItem("userRole", res.data.role || "user");

      alert("Login successful");
      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        alert(`Server Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        alert("No response from server. Check backend or HTTP settings.");
      } else {
        alert(`Request Error: ${err.message}`);
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Username or Email" onChange={handleChange} required /><br /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
