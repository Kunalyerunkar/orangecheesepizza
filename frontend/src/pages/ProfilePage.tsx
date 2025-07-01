import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";

const ProfilePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

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

  const safeSetFirstName = (value: string) => {
    if (isMounted.current) setFirstName(value);
  };

  const safeSetLastName = (value: string) => {
    if (isMounted.current) setLastName(value);
  };

  const safeSetEmail = (value: string) => {
    if (isMounted.current) setEmail(value);
  };

  const safeSetPhone = (value: string) => {
    if (isMounted.current) setPhone(value);
  };

  const safeSetAddress = (value: string) => {
    if (isMounted.current) setAddress(value);
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Load user data
  useEffect(() => {
    if (user) {
      safeSetFirstName(user.firstName || "");
      safeSetLastName(user.lastName || "");
      safeSetEmail(user.email || "");
      safeSetPhone(user.phoneNumber || "");
      safeSetAddress(user.address || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    safeSetLoading(true);

    try {
      const response = await axios.put("/api/users/profile", {
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        address,
      });

      if (response.status === 200 && isMounted.current) {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (isMounted.current) {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      safeSetLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container page-container">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="input"
                  value={firstName}
                  onChange={(e) => safeSetFirstName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="input"
                  value={lastName}
                  onChange={(e) => safeSetLastName(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="input"
                  value={email}
                  onChange={(e) => safeSetEmail(e.target.value)}
                  disabled={!!user?.email}
                />
                {user?.email && (
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="input"
                  value={phone}
                  onChange={(e) => safeSetPhone(e.target.value)}
                  disabled={!!user?.phoneNumber}
                />
                {user?.phoneNumber && (
                  <p className="text-xs text-gray-500 mt-1">
                    Phone number cannot be changed
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  rows={3}
                  className="input"
                  value={address}
                  onChange={(e) => safeSetAddress(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
