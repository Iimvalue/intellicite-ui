import { useRef, useState, useEffect } from "react";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import {
  getProfile,
  updateProfile,
  isAuthenticated,
} from "../services/authService";
import { Navigate } from "react-router";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);

  const toast = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!isAuthenticated()) throw new Error("User is not authenticated");
        const userProfile = await getProfile();
        setName(userProfile.user.name);
        setEmail(userProfile.user.email);
        setEditedName(userProfile.user.name);
        setEditedEmail(userProfile.user.email);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const confirmUpdate = () => {
    confirmDialog({
      group: "update-profile",
      message: "Are you sure you want to update your profile?",
      header: "Confirm Update",
      icon: "pi pi-exclamation-triangle",
    });
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-800 border-solid"></div>
      </div>
    );
  }

  return (
    <>
      <Toast ref={toast} />

      <ConfirmDialog
        group="update-profile"
        content={({ headerRef, contentRef, footerRef, hide, message }) => (
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-xl max-w-sm mx-auto">
            <div className="rounded-full bg-blue-800 flex items-center justify-center h-24 w-24 -mt-12">
              <i
                className="pi pi-question text-white"
                style={{ fontSize: "40px" }}
              ></i>
            </div>
            <span
              className="font-bold text-xl mt-6 mb-2 text-gray-800"
              ref={headerRef}
            >
              {message.header}
            </span>
            <p
              className="text-center text-gray-600 text-sm mb-4"
              ref={contentRef}
            >
              {message.message}
            </p>
            <div className="flex justify-center gap-3" ref={footerRef}>
              <button
                onClick={async (e) => {
                  hide(e);
                  try {
                    await updateProfile(editedName, editedEmail, profileImage);
                    setName(editedName);
                    setEmail(editedEmail);
                    toast.current.show({
                      severity: "success",
                      summary: "Updated",
                      detail: "Profile updated successfully",
                      life: 3000,
                    });
                  } catch (error) {
                    console.error("Update failed:", error);

                    const backendMsg = error.response?.data?.message;
                    // console.error("Backend message:", backendMsg);
                    // Customize the error message based on backend response
                    let customMessage =
                      "Something went wrong. Please try again.";
                    if (backendMsg === "User with this email already exists") {
                      customMessage =
                        "This email is already registered, Please try a diffrferent email";
                    }
                    toast.current.show({
                      severity: "error",
                      summary: "Failed",
                      detail: customMessage,
                      life: 3000,
                    });
                  }
                }}
                className="px-5 py-2 text-white bg-blue-800 hover:bg-blue-700 rounded text-sm"
              >
                Confirm
              </button>
              <button
                onClick={(e) => {
                  hide(e);
                  toast.current.show({
                    severity: "warn",
                    summary: "Cancelled",
                    detail: "Update was cancelled",
                    life: 2000,
                  });
                }}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      />

      {isAuthenticated() ? (
        <div className="min-h-screen bg-gray-50 pt-28">
          {" "}
          {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="bg-white rounded-xl shadow p-6 sm:flex flex-col text-center sm:flex-row justify-center sm:justify-start items-center gap-6">
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                {profileImage ? (
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={profileImage}
                    alt="Profile"
                  />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex items-center">
                  <label className="text-gray-700 text-lg font-semibold mr-2">
                    Name:
                  </label>
                  <p className="text-lg text-blue-800">{name}</p>
                </div>
                <div className="flex items-center">
                  <label className="text-gray-700 text-lg font-semibold mr-2">
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
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />
                </div>
                <div className="pt-4">
                  <button
                    className="w-full bg-blue-800 text-white font-bold py-3 rounded mt-2 hover:bg-blue-700 transition-colors text-lg cursor-pointer"
                    onClick={confirmUpdate}
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
}
