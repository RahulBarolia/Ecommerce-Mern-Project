import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProviderContext";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { resetPassword } = useContext(AuthContext);

  const [newPass, setNewPass] = useState({
    password: "",
    passwordConfirm: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInput = (e) => {
    setNewPass({ ...newPass, [e.target.name]: e.target.value });
    setError("");
  };

  const submitResetPassword = async () => {
    const response = await resetPassword(newPass);

    if (response?.data?.success) {
      toast(response?.data?.message);
      localStorage.removeItem("reset_token");
      localStorage.removeItem("email");
      localStorage.removeItem("resetPasswordOtpExpiresAt");
      navigate("/login");
    }
    if (!response?.response?.data?.success) {
      toast.error(response?.response?.data?.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitResetPassword();
  };

  return (
    <div className="full min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-4 shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h1>

        {error ? (
          <p className="p-2 my-2 rounded text-center bg-red-400">{error}</p>
        ) : (
          <p></p>
        )}

        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="New Password"
              name="password"
              value={newPass.password}
              onChange={handleInput}
              className="px-2 py-2 w-full border border-gray-500 focus:outline-none focus:border-blue-500 rounded "
              placeholder="Enter your new password"
            />
          </div>

          <div>
            <input
              type="Confirm Password"
              name="passwordConfirm"
              value={newPass.passwordConfirm}
              onChange={handleInput}
              className="px-2 py-2 w-full border border-gray-500 focus:outline-none focus:border-blue-500 rounded "
              placeholder="Enter your confirm password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
