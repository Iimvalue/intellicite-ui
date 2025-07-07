import { useState, useEffect } from "react";
import {
  getProfile,
  updateProfile,
  isAuthenticated,
} from "../services/authService";
import { Navigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ChangeProfile = async () => {
      try {
        if (!isAuthenticated()) {
          throw new Error("User is not authenticated");
        }
        const userProfile = await getProfile();
        setName(userProfile.user.name);
        setEmail(userProfile.user.email);
        setEditedName(userProfile.user.name);
        setEditedEmail(userProfile.user.email);
        console.log(userProfile);
        // setProfileImage(userProfile.profileImage);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    console.log(isAuthenticated());
    ChangeProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex text-gray-700 items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }
 const handleUpdateProfile = async () => {
  try {
    await updateProfile(editedName, editedEmail, profileImage);
    setName(editedName);
    setEmail(editedEmail);
    // setProfileImage(profileImage); 
      toast.success("Profile updated successfully", {
        position: "top-center",
        autoClose: 3000,
        className:
          "toast bg-blue-100 border-2 border-blue-300 text-blue-800 font-semibold rounded-lg shadow",
        bodyClassName: "text-sm p-2",
      });
  } catch (error) {
    console.error("Failed to update profile:", error);
    toast.error("Failed to update profile. Please try again", {
        position: "top-center",
        autoClose: 3000,
        className:
          "toast bg-red-100 border-2 border-red-300 text-red-800 font-semibold rounded-lg shadow",
        bodyClassName: "text-sm p-2",
      });
  }
};

  return (
    <>
        <ToastContainer />
      {isAuthenticated() ? (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="bg-white rounded-xl shadow p-6 sm:flex flex-col text-center sm:flex-row justify-center  sm:justify-start items-center gap-6">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-3xl text-white">
                <img
                  className="w-full h-full object-cover rounded-full"
                  src={null}
                  alt=""
                />
              </div>
              <div>
                <div className="flex items-center">
                  <label
                    htmlFor="name"
                    className="text-gray-700 text-lg font-semibold mr-2"
                  >
                    Name:
                  </label>
                  <p className="text-lg text-blue-800">{name}</p>
                </div>

                <div className="flex items-center">
                  <label
                    htmlFor="email"
                    className="text-gray-700 text-lg font-semibold mr-2"
                  >
                    Email:
                  </label>
                  <p className="text-lg text-blue-800">{email}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-8 border-b-2 border-gray-300 pb-2">
                Personal Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Your Full Name"
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700  mb-1 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Your Email Address"
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />
                </div>
                {/* <div>
                <label className="block text-gray-700 mb-1 font-medium">Profile Image</label>
                <input
                    type="text"
                    placeholder="Image URL"
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                />
                </div> */}
                <div className="pt-4">
                  <button
                     className="w-full bg-blue-800 text-white font-bold py-3 rounded mt-2 hover:bg-blue-700 transition-colors text-lg cursor-pointer"
                    onClick={handleUpdateProfile}
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to="/login" replace={true} />
      )}
    </>
  );
}
