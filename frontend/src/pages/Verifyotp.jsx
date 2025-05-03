import React, { useContext, useRef, useState } from "react";
import loginlogo from "../assets/loginlogo.png";
import lock from "../assets/lock.jpeg";
import { AuthContext } from "../context/authContext";
import { verifyOtp } from "../services/apis";
import { useNavigate } from "react-router-dom";


function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const inputsRef = useRef([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = otp.split("");
      newOtp[index] = value;
      setOtp(newOtp.join(""));

      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    if (otp.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    try {
      setLoading(true); // 👈 start loading
      setError("");
      const result = await verifyOtp({ email: user.email, otp });
      console.log(result);
      navigate("/dashboard");
      localStorage.setItem("token", result.token);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false); // 👈 stop loading
    }
  };

  return (
    <div className="bg-[#d9d1aa] h-screen flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-lg rounded-3xl flex flex-col items-center gap-6 p-8 shadow-lg">
        <img src={lock} alt="" className="w-36 h-36 object-cover mt-4" />

        <p className="text-2xl font-bold text-gray-800">Enter OTP Code</p>
        <p className="text-sm text-gray-500 -mt-4">
          We've sent a 6-digit code to your email
        </p>

        <div className="flex gap-3 mt-4">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={otp[index] || ""}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-14 h-14 text-center border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8fc63a] text-2xl transition-all"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>
        )}

        <button
          className="bg-[#8fc63a] px-24 py-3 rounded-2xl text-lg text-white font-bold mt-6 hover:bg-[#7db12f] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
          "loading..."
          ) : (
            "Verify"
          )}
        </button>

        <p className="text-sm text-gray-500">
          Didn't receive the code?{" "}
          <span className="text-[#8fc63a] font-medium cursor-pointer hover:underline">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;
