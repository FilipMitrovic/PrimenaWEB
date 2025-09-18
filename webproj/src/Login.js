import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./services/userService";
import { LoginDTO } from "./models/LoginDTO";
import { jwtDecode } from "jwt-decode";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginDto = new LoginDTO(formData.name, formData.password);
      const res = await loginUser(loginDto);

      const token = res.data.token;
      if (!token) {
        alert("Login failed: no token returned");
        return;
      }

      const decoded = jwtDecode(token);
      console.log("Decoded JWT token:", decoded);

      localStorage.setItem("token", token);
      localStorage.setItem("userName", decoded.unique_name || formData.name);
      localStorage.setItem("userRole", decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "user");
      localStorage.setItem("userEmail", decoded.email || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||"");
      localStorage.setItem("userImage", decoded.image || "");

      alert("Login successful");
      navigate("/quizzes");
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
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Username or Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit" className="btn btn-success">Login</button>
      </form>
      <br />
      <button className="btn btn-primary" onClick={() => navigate("/register")}>Register</button>
    </div>
  );
};

export default Login;
