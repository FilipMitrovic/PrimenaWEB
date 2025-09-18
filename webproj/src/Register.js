import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./services/userService";
import User from "./models/User";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    role: "user"
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "role") {
      setFormData({ ...formData, role: checked ? "admin" : "user" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userDto = new User(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.image
      );

      const res = await registerUser(userDto);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      localStorage.setItem("userName", res.data.name || formData.name);
      localStorage.setItem("userRole", res.data.role || formData.role);
      localStorage.setItem("userEmail", res.data.email || formData.email);
      localStorage.setItem("userImage", res.data.image || formData.image || "");

      alert("User registered successfully please login!");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
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
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Username" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="text" name="image" placeholder="Image URL (optional)" value={formData.image} onChange={handleChange} />
        <label>
          <input type="checkbox" name="role" checked={formData.role === "admin"} onChange={handleChange}/> Become admin
        </label>
        <button type="submit" className="btn btn-success">Register</button>
      </form>
    </div>
  );
};

export default Register;
