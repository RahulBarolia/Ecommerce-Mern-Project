import React, { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthProviderContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ResetPasswordOtp = () => {
  const { userOtpConfirmForResetPass, resendOtpForResetPass } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const [inputs, setInputs] = useState(new Array(6).fill(""));
  const [inputArr, setInputArr] = useState(inputs);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const copyArray = [...inputArr];
    copyArray[index] = value;
    setInputArr(copyArray);
    if (index < inputArr.length - 1) refs[index + 1].current.focus();
  };

  const handleKey = (event, index) => {
    if (event.keyCode === 8) {
      const copyArray = [...inputArr];
      copyArray[index] = "";
      setInputArr(copyArray);
      if (index > 0) refs[index - 1].current.focus();
    }
    if (event.keyCode === 39 && index < inputArr.length - 1)
      refs[index + 1].current.focus();
    if (event.keyCode === 37 && index > 0) refs[index - 1].current.focus();
  };

  const handlePaste = (event) => {
    const data = event.clipboardData.getData("text");
    const dataArray = data.split("");
    setInputArr(dataArray);
    refs[inputArr.length - 1].current.focus();
  };

  const submitOtp = async () => {
    const code = inputArr.join("");

    try {
      const response = await userOtpConfirmForResetPass(code);
      console.log(response);
      if (response?.data?.success) {
        localStorage.setItem("reset_token", response?.data?.reset_token);
        toast.success(response?.data?.message);
        navigate("/reset-password");
      } else if (response?.response?.data?.message) {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startTimer = async () => {
    try {
      const response = await resendOtpForResetPass();

      if (response?.data?.success) {
        toast.success(response?.data?.message);

        localStorage.setItem(
          "resetPasswordOtpExpiresAt",
          response?.data?.user?.resetPasswordOtpExpiresAt
        );

        setTimer(5 * 60);
        setIsTimerRunning(true);
      } else {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initializeTimer = () => {
    const storedExpiration = localStorage.getItem("resetPasswordOtpExpiresAt");
    if (storedExpiration) {
      const expirationDate = new Date(storedExpiration);
      const currentTime = new Date();
      const remainingTime = Math.floor((expirationDate - currentTime) / 1000);

      if (remainingTime > 0) {
        setTimer(remainingTime);
        setIsTimerRunning(true);
      } else {
        localStorage.removeItem("resetPasswordOtpExpiresAt");
        setTimer(0);
        setIsTimerRunning(false);
      }
    }
  };

  useEffect(() => {
    initializeTimer();
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            localStorage.removeItem("resetPasswordOtpExpiresAt");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-2 rounded space-y-4 shadow-md">
        <h1 className="text-center font-bold text-2xl">OTP Verification</h1>
        <p>
          We've sent a <span className="font-semibold">OTP</span> to your
          registered email address to help you reset your password. Please enter
          the OTP below to proceed.
        </p>
        <div className="flex space-x-4 justify-center">
          {inputs?.map((input, index) => (
            <div key={index}>
              <input
                type="text"
                className="w-[50px] h-[50px] rounded border-2 border-gray-600 focus:outline-none focus:border-blue-600 text-center text-xl font-semibold"
                maxLength="1"
                ref={refs[index]}
                value={inputArr[index]}
                onKeyDown={(event) => handleKey(event, index)}
                onChange={(event) => handleInput(event, index)}
                onPaste={handlePaste}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            className={`text-xl ${
              timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-500"
            }`}
            onClick={startTimer}
            disabled={timer > 0}
          >
            Resend OTP
          </button>

          <div className="timer">
            <p className=" bg-slate-400 px-2 py-1 rounded">
              <span>request new OTP in </span>{" "}
              <span className="font-semibold">
                {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}{" "}
                seconds
              </span>
            </p>
          </div>
        </div>

        <button
          className="w-full py-2 text-center font-semibold border-none rounded bg-blue-500"
          onClick={submitOtp}
        >
          Submit OTP
        </button>
      </div>
    </div>
  );
};
