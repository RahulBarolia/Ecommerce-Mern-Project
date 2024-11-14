import React, { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProviderContext";
import { toast } from "react-toastify";

const ResetPassEmail = () => {
  const { userEmailConfirmForResetPass } = useContext(AuthContext);

  const [emailData, setEmailData] = useState({
    email: "",
  });

  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleInput = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
    setError("");
  };

  const EmailConfirmForResetPass = async () => {
    const response = await userEmailConfirmForResetPass(emailData);

    if (response?.data?.success) {
      toast.success(response?.data?.message);
      setEmailData({
        email: "",
      });
      localStorage.setItem("email", response?.data?.user?.email);
      localStorage.setItem(
        "resetPasswordOtpExpiresAt",
        response?.data?.user?.resetPasswordOtpExpiresAt
      );
      navigate("/reset-password-opt-verify");
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
    EmailConfirmForResetPass();
  };

  return (
    <div className="full min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-4 shadow-md">
        <h1 className="text-xl font-semibold text-center mb-4">
          Verify Your Email to Reset Password
        </h1>

        {error ? (
          <p className="p-2 my-2 rounded text-center bg-red-400">{error}</p>
        ) : (
          <p></p>
        )}

        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="email"
              value={emailData.email}
              className="px-2 py-2 w-full border border-gray-500 focus:outline-none focus:border-blue-500 rounded "
              placeholder="Enter your email"
              onChange={handleInput}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-700"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassEmail;
