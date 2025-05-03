import React, { useContext, useState } from 'react';
import loginlogo from "../assets/loginlogo.png";
import { signup } from '../services/apis';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { Link } from 'react-router-dom'; 

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();



if (validate()) {
  try {
    setLoading(true); 
    const result = await signup({ email: email, password: password });
    console.log(result.user);
    setApiError("");
    login(result.user);
    navigate("/verify-otp");
  } catch (error) {
    console.error("Error during signup:", error);
    if (error.response?.data?.message) {
      setApiError(error.response.data.message);
    } else {
      setApiError("Something went wrong. Please try again.");
    }
  } finally {
    setLoading(false); 
  }
}
  };

  return (
    <div className="bg-[#d9d1aa] h-screen  overflow-auto flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl flex flex-col items-center gap-6 p-8 shadow-xl">
        <img src={loginlogo} alt="Logo" className="w-24 h-24 object-contain" />

        <h2 className="text-3xl font-bold text-gray-800">Sign Up</h2>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full h-12 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 text-gray-700 shadow-sm focus:ring-2 focus:ring-[#8fc63a] focus:outline-none transition`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Create Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className={`w-full h-12 bg-white border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 text-gray-700 shadow-sm focus:ring-2 focus:ring-[#8fc63a] focus:outline-none transition`}
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className={`w-full h-12 bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 text-gray-700 shadow-sm focus:ring-2 focus:ring-[#8fc63a] focus:outline-none transition`}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
  type="submit"
  className="w-full h-12 bg-[#8fc63a] rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-[#7db12f] transition shadow-md mt-2 disabled:opacity-60"
  disabled={loading}
>
  {loading ? (
    <>
      Signing up...
    </>
  ) : (
    "Sign Up"
  )}
</button>        </form>

        {apiError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-300 p-3 rounded-lg">
            {apiError}
          </div>
        )}

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#8fc63a] font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
