import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { Link } from "react-router-dom";
import Input from "../../components/Common/Input/Input";
import Button from "../../components/Common/Button/Button";
import Card from "../../components/Common/Card/Card";

import { registerUser } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "Member",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      await registerUser(formData);

      alert("Registration Successful 🎉");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="login-page">

      <div className="login-left">
        <h2>Create your account</h2>

<p>
  Join your team workspace and start collaborating
</p>
      </div>

      <div className="login-right">

        <Card>

          <h2>Create Account</h2>

          <Input
            label="Full Name"
            name="full_name"
            placeholder="Enter Full Name"
            value={formData.full_name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="input-group">
            <label>Role</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option>Admin</option>
              <option>Manager</option>
              <option>Member</option>
            </select>
          </div>

          <Button onClick={handleRegister}>
  Create account
</Button>

          <p style={{ marginTop: "20px", textAlign: "center" }}>
  Already have an account?{" "}
  <Link to="/login">Login</Link>
</p>

        </Card>

      </div>

    </div>
  );
};

export default Register;