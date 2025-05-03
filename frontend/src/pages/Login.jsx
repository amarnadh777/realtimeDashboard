import React, { useState, useContext } from 'react';
import loginlogo from "../assets/loginlogo.png";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/apis';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);  // New loading state

  const { login: authenticate } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        setLoading(true);  // Start loader
        const result = await loginUser({ email, password });
        console.log(result);
        setApiError("");
        authenticate(result);
        navigate("/dashboard");
      } catch (error) {
        console.error("Error during login:", error);
        if (error.response?.data?.message) {
          setApiError(error.response.data.message);
        } else {
          setApiError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);  // Stop loader
      }
    }
  };

  return (
    <div className="bg-[#d9d1aa] h-screen flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl flex flex-col items-center gap-6 p-8 shadow-xl">
        <img src={loginlogo} alt="Logo" className="w-24 h-24 object-contain" />
        <h2 className="text-3xl font-bold text-gray-800">Login</h2>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full h-12 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`w-full h-12 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4`}
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-[#8fc63a] rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-[#7db12f] transition shadow-md mt-2 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <>
               Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {apiError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-300 p-3 rounded-lg w-full">
            {apiError}
          </div>
        )}

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#8fc63a] font-semibold">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
