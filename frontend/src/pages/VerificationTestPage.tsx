import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../utils/authContext";

const VerificationTestPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const { sendVerificationCode, verifyCode } = useAuth();

  // Log things directly on the page for easier debugging
  const addLog = (log: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    addLog(`Sending code to ${phoneNumber}`);

    try {
      // Format phone number
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+${formattedPhone}`;
      }

      // Remove spaces and non-digit characters except leading +
      formattedPhone = formattedPhone.startsWith("+")
        ? "+" + formattedPhone.substring(1).replace(/\D/g, "")
        : formattedPhone.replace(/\D/g, "");

      addLog(`Formatted phone: ${formattedPhone}`);

      // Try to get the verification code directly from the backend
      try {
        const directResponse = await axios.post(
          "http://localhost:5000/api/users/send-verification",
          {
            phoneNumber: formattedPhone,
          }
        );
        addLog(`Direct API response: ${JSON.stringify(directResponse.data)}`);
      } catch (err: any) {
        addLog(`Direct API error: ${err.message}`);
      }

      // Use the standard auth context method
      const response = await sendVerificationCode(formattedPhone);
      addLog(`Standard API response: ${JSON.stringify(response.data)}`);

      setMessage("Verification code sent! Check the server logs for the code.");
      setStep("verification");
    } catch (err: any) {
      console.error("Error sending code:", err);
      addLog(`Error: ${err.message}`);

      if (err.response?.data?.error) {
        addLog(`Detailed error: ${err.response.data.error}`);
      }

      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    addLog(`Verifying code: ${verificationCode}`);

    try {
      // Format phone number
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+${formattedPhone}`;
      }

      // Remove spaces and non-digit characters except leading +
      formattedPhone = formattedPhone.startsWith("+")
        ? "+" + formattedPhone.substring(1).replace(/\D/g, "")
        : formattedPhone.replace(/\D/g, "");

      // Try to verify directly
      try {
        const directResponse = await axios.post(
          "http://localhost:5000/api/users/verify-code",
          {
            phoneNumber: formattedPhone,
            code: verificationCode,
          }
        );
        addLog(
          `Direct verification response: ${JSON.stringify(directResponse.data)}`
        );
      } catch (err: any) {
        addLog(`Direct verification error: ${err.message}`);
      }

      // Use standard method
      await verifyCode(formattedPhone, verificationCode);
      setMessage("Successfully verified!");
    } catch (err: any) {
      console.error("Error verifying code:", err);
      addLog(`Verification error: ${err.message}`);

      if (err.response?.data?.error) {
        addLog(`Detailed error: ${err.response.data.error}`);
      }

      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Verification Test Page</h1>

        {message && (
          <div
            className={`p-4 mb-6 rounded ${
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Phone Number (with country code)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter code"
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="flex-1 bg-gray-300 text-gray-700 p-3 rounded hover:bg-gray-400"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Debug Logs</h2>
          <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-sm h-48 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationTestPage;
