import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./services/userService";
import User from "./models/User";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    role: ""
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "role") {
      setFormData({ ...formData, role: checked ? "admin" : "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kreira DTO objekt za backend
      const userDto = new User(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.image
      );

      const res = await registerUser(userDto);

      localStorage.setItem("token", res.data.token || ""); // ako backend vrati token
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("userEmail", res.data.email);
      localStorage.setItem("userImage", res.data.image || "");

      alert("User registered successfully");
      navigate("/profile");
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Username" onChange={handleChange} required /><br /><br />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br /><br />
        <input type="text" name="image" placeholder="Image URL (optional)" onChange={handleChange} /><br /><br />

        <label>
          <input
            type="checkbox"
            name="role"
            checked={formData.role === "admin"}
            onChange={handleChange}
          /> Become admin
        </label>
        <br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
