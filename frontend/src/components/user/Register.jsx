import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthProviderContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);

  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleInput = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setError("");
  };

  const userRegister = async () => {
    const response = await register(signupData);

    if (response?.data?.success) {
      localStorage.setItem("email", response.data.user.email);
      toast.success(response?.data?.message);
      setSignupData({
        name: "",
        email: "",
        password: "",
      });
      localStorage.setItem(
        "verificationOtpExpiresAt",
        response?.data?.user?.verificationOtpExpiresAt
      );
      navigate("/verify-email-otp");
    } else {
      toast.error(response?.response?.data.error);
      setError(response?.response?.data?.error);
    }

    if (!response?.response?.data?.success) {
      toast.error(response?.response?.data?.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userRegister();
  };

  return (
    <div className="full min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-4 shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Signup</h1>

        {error ? (
          <p className="p-2 my-2 rounded text-center bg-red-400">{error}</p>
        ) : (
          <p></p>
        )}
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              className="px-2 py-2 w-full border border-gray-500 focus:outline-none focus:border-blue-500 rounded "
              placeholder="Enter your name"
              onChange={handleInput}
              name="name"
              value={signupData.name}
            />
          </div>

          <div>
            <input
              type="text"
              className="px-2 py-2 w-full border border-gray-500 focus:outline-none focus:border-blue-500 rounded "
              placeholder="Enter your email"
              onChange={handleInput}
              name="email"
              value={signupData.email}
            />
          </div>

          <div>
            <input
              type="password"
              className="px-2 py-2 w-full border border-gray-500 focus:outline-none focus:border-blue-500 rounded "
              placeholder="Enter your password"
              onChange={handleInput}
              name="password"
              value={signupData.password}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-700"
          >
            Sign Up
          </button>

          <p>
            Already have an account{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>{" "}
            here
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
