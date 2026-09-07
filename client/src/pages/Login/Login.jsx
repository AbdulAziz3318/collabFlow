import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Link } from "react-router-dom";
import Input from "../../components/Common/Input/Input";
import Button from "../../components/Common/Button/Button";
import Card from "../../components/Common/Card/Card";

import { loginUser } from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
  console.log("Form Data:", formData);

  try {
    const response = await loginUser(formData);

    console.log("Response:", response.data);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    alert("Login Successful 🎉");

    navigate("/");
  } catch (error) {
    console.log("Error:", error.response?.data);

    alert(error.response?.data?.message || "Login Failed");
  }
};

  return (
    <div className="login-page">
      <div className="login-left">
        <h1>CollabFlow AI</h1>

        <p>
          Manage projects, collaborate with your team,
          track tasks and boost productivity from one place.
        </p>
      </div>

      <div className="login-right">
        <Card>
  <h2>Welcome back</h2>

  <p>
    Sign in to your CollabFlow workspace
  </p>

  <Input
    label="Email"
    name="email"
    placeholder="you@example.com"
    value={formData.email}
    onChange={handleChange}
  />

  <Input
    label="Password"
    name="password"
    type="password"
    placeholder="Enter your password"
    value={formData.password}
    onChange={handleChange}
  />

  <Button onClick={handleLogin}>
    Sign in
  </Button>

  <p style={{ marginTop: "20px", textAlign: "center" }}>
    Don't have an account?{" "}
    <Link to="/register">
      Create account
    </Link>
  </p>
</Card>
      </div>
    </div>
  );
};

export default Login;