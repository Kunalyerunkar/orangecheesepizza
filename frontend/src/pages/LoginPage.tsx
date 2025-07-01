import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState("phone"); // "phone" or "verification"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, sendVerificationCode, verifyCode } = useAuth();
  const isMounted = useRef(true);

  // Add a direct email login option to bypass phone verification
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"

  // Add timer for OTP
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Cleanup function when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Safe state setter functions
  const safeSetLoading = (value: boolean) => {
    if (isMounted.current) setLoading(value);
  };

  const safeSetError = (value: string) => {
    if (isMounted.current) setError(value);
  };

  const safeSetTimer = (value: number) => {
    if (isMounted.current) setTimer(value);
  };

  const safeSetCanResend = (value: boolean) => {
    if (isMounted.current) setCanResend(value);
  };

  const safeSetStep = (value: string) => {
    if (isMounted.current) setStep(value);
  };

  // Set up timer when OTP is sent
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout> | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        if (isMounted.current) {
          setTimer(timer - 1);
        }
      }, 1000);
    } else if (timer === 0 && step === "verification") {
      safeSetCanResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    safeSetLoading(true);
    safeSetError("");

    try {
      await login(email, password);
      if (isMounted.current) {
        toast.success("Successfully logged in!");
        navigate("/");
      }
    } catch (err: any) {
      console.error("Error during email login:", err);
      if (isMounted.current) {
        safeSetError(
          err.response?.data?.message || "Failed to log in. Please try again."
        );

        // Special handling for network errors
        if (
          err.message?.includes("network") ||
          err.message?.includes("failed")
        ) {
          safeSetError(
            "Connection issue detected. Please check your internet connection and try again."
          );
        }
      }
    } finally {
      safeSetLoading(false);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    safeSetLoading(true);
    safeSetError("");

    try {
      // Format phone number to ensure it has the country code and remove spaces
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+${formattedPhone}`;
      }

      // Remove spaces and other non-digit characters except the leading +
      formattedPhone = formattedPhone.startsWith("+")
        ? "+" + formattedPhone.substring(1).replace(/\D/g, "")
        : formattedPhone.replace(/\D/g, "");

      console.log("About to send verification code to:", formattedPhone);

      // Send verification code
      const response = await sendVerificationCode(formattedPhone);
      console.log("Verification code sent successfully:", response);

      if (isMounted.current) {
        // Set timer for 10 minutes (600 seconds)
        safeSetTimer(600);
        safeSetCanResend(false);

        // Explicitly log step change and force a render
        console.log("Current step before change:", step);
        safeSetStep("verification");
        console.log("Step changed to:", "verification");

        // Force re-render
        setTimeout(() => {
          if (isMounted.current) {
            console.log("Forcing re-render, current step:", step);
          }
        }, 100);

        toast.success("Verification code sent! Valid for 10 minutes.");
      }
    } catch (err: any) {
      console.error("Error sending verification code:", err);
      if (isMounted.current) {
        // Handle detailed error messages from the server
        if (err.response?.data?.error) {
          console.error("Detailed error:", err.response.data.error);
          if (err.response.data.stack) {
            console.error("Error stack:", err.response.data.stack);
          }
        }

        safeSetError(
          err.response?.data?.message ||
            "Failed to send verification code. Please try again."
        );

        // Special handling for network errors
        if (
          err.message?.includes("network") ||
          err.message?.includes("failed")
        ) {
          safeSetError(
            "Connection issue detected. Please check your internet connection and try again."
          );
        }
      }
    } finally {
      safeSetLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) {
      return;
    }

    safeSetLoading(true);
    safeSetError("");

    try {
      // Format phone number to ensure it has the country code and remove spaces
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+${formattedPhone}`;
      }

      // Remove spaces and other non-digit characters except the leading +
      formattedPhone = formattedPhone.startsWith("+")
        ? "+" + formattedPhone.substring(1).replace(/\D/g, "")
        : formattedPhone.replace(/\D/g, "");

      // Resend verification code
      await sendVerificationCode(formattedPhone);

      if (isMounted.current) {
        // Reset timer
        safeSetTimer(600);
        safeSetCanResend(false);

        toast.success("New verification code sent! Valid for 10 minutes.");
      }
    } catch (err: any) {
      console.error("Error resending verification code:", err);
      if (isMounted.current) {
        safeSetError(
          err.response?.data?.message ||
            "Failed to resend verification code. Please try again."
        );

        // Special handling for network errors
        if (
          err.message?.includes("network") ||
          err.message?.includes("failed")
        ) {
          safeSetError(
            "Connection issue detected. Please check your internet connection and try again."
          );
        }
      }
    } finally {
      safeSetLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (timer === 0) {
      safeSetError("Verification code has expired. Please request a new code.");
      return;
    }

    safeSetLoading(true);
    safeSetError("");

    try {
      // Format phone number to ensure it has the country code and remove spaces
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+${formattedPhone}`;
      }

      // Remove spaces and other non-digit characters except the leading +
      formattedPhone = formattedPhone.startsWith("+")
        ? "+" + formattedPhone.substring(1).replace(/\D/g, "")
        : formattedPhone.replace(/\D/g, "");

      // Verify the code
      await verifyCode(formattedPhone, verificationCode.trim());

      if (isMounted.current) {
        toast.success("Successfully logged in!");
        navigate("/");
      }
    } catch (err: any) {
      console.error("Error verifying code:", err);
      if (isMounted.current) {
        safeSetError(
          err.response?.data?.message ||
            "Failed to verify code. Please try again."
        );

        // Special handling for network errors
        if (
          err.message?.includes("network") ||
          err.message?.includes("failed")
        ) {
          safeSetError(
            "Connection issue detected. Please check your internet connection and try again."
          );
        }
      }
    } finally {
      safeSetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary-dark"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setLoginMethod("email")}
            className={`px-4 py-2 rounded-md ${
              loginMethod === "email"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod("phone")}
            className={`px-4 py-2 rounded-md ${
              loginMethod === "phone"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Phone
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {loginMethod === "email" ? (
          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <>
            {step === "phone" ? (
              <form className="mt-8 space-y-6" onSubmit={handleSendCode}>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number (with country code)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Include country code (e.g., +1 for US, +91 for India)
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </button>
              </form>
            ) : (
              <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Verification Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter code"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                  {timer > 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      Code expires in: {formatTime(timer)}
                    </p>
                  )}
                  {timer === 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      Code expired. Please request a new one.
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || timer === 0}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={!canResend || loading}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {canResend ? "Resend Code" : "Wait to Resend"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
