import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthProviderContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import CartContext from "../../context/CartProviderContext";
import WishlistContext from "../../context/WishlistProviderContext";

const Login = () => {
  const { login } = useContext(AuthContext);

  const { fetchCartItems } = useContext(CartContext);

  const { fetchWishlistItems } = useContext(WishlistContext);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleInput = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError("");
  };

  const userLogin = async () => {
    try {
      const response = await login(loginData);

      if (response?.data?.success && response?.data?.user?.isVerified) {
        setLoginData({
          email: "",
          password: "",
        });

        await fetchCartItems();
        await fetchWishlistItems();
        navigate("/");
      } else {
        if (
          response?.response?.data?.error &&
          !response?.response?.data?.success
        ) {
          const errorMessage = response?.response?.data?.error;
          setError(errorMessage);
        } else if (
          !response?.response?.data?.success &&
          !response?.response?.data?.isEmailVerified
        ) {
          toast.error("Please verify your email to continue.");
          navigate("/verify-email-otp");
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userLogin();
  };

  return (
    <div className="full min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-4 shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Login</h1>

        {error ? (
          <p className="p-2 my-2 rounded text-center bg-red-400">{error}</p>
        ) : (
          <p></p>
        )}
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="email"
              value={loginData.email}
              className="px-2 py-2 w-full border border-gray-500 focus:outline-none focus:border-blue-500 rounded "
              placeholder="Enter your email"
              onChange={handleInput}
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={loginData.password}
              className="px-2 py-2 w-full border border-gray-500 focus:outline-none focus:border-blue-500 rounded "
              placeholder="Enter your password"
              onChange={handleInput}
            />
          </div>

          <p className="text-right text-blue-500">
            <Link to="/verify-email-for-reset-password">Forgot Password?</Link>
          </p>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-700"
          >
            Login
          </button>

          <p>
            Don't have an account ?{" "}
            <Link to="/signup" className="text-blue-500">
              Sign up
            </Link>{" "}
            here
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
