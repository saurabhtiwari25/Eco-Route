import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "driver"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form.email, form.password, form.role);
    navigate("/login");
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) =>
  setForm(prev => ({ ...prev, email: e.target.value }))
}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) =>
  setForm(prev => ({ ...prev, password: e.target.value }))
}
        />

        <select
          onChange={(e) =>
  setForm(prev => ({ ...prev, role: e.target.value }))
}
        >
          <option value="driver">Driver</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}