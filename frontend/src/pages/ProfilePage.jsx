import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Settings, UserCircle, Upload, Save, XCircle } from "lucide-react";
import apiService from "../services/apiService";
import useAuthStore from "../store/authStore";
import Button from "../components/Button";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";

const ProfilePage = ({ navigate }) => {
  const {
    userInfo,
    isAuthenticated,
    logout,
    login: updateUserInStore,
  } = useAuthStore();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    description: "",
    country: "",
    profilePicture: "",
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  const effectRan = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !userInfo?.token) {
      toast.error("Please login to view your profile.");
      navigate("login");
      return;
    }

    if (effectRan.current === true && process.env.NODE_ENV === "development")
      return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await apiService.getUserProfile(userInfo.token);
        setProfileData(data);

        setFormData({
          username: data.username || "",
          description: data.description || "",
          country: data.country || "",
          profilePicture: "",
        });
        setProfilePicturePreview(data.profilePicture || null);
      } catch (error) {
        toast.error(error.message || "Could not fetch profile.");
        if (error.message.toLowerCase().includes("not authorized")) {
          logout();
          navigate("login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    return () => {
      effectRan.current = true;
    };
  }, [isAuthenticated, userInfo, navigate, logout]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image is too large. Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatePayload = {};
      if (
        formData.username.trim() &&
        formData.username !== profileData.username
      ) {
        updatePayload.username = formData.username;
      }
      if (formData.description !== (profileData.description || "")) {
        updatePayload.description = formData.description;
      }
      if (formData.country !== (profileData.country || "")) {
        updatePayload.country = formData.country;
      }
      if (formData.profilePicture) {
        updatePayload.profilePicture = formData.profilePicture;
      }

      if (Object.keys(updatePayload).length === 0) {
        toast.success("No changes to save.");
        setIsEditMode(false);
        return;
      }

      const updatedUserData = await apiService.updateUserProfile(
        updatePayload,
        userInfo.token
      );

      updateUserInStore(updatedUserData);

      setProfileData(updatedUserData);

      toast.success("Profile updated successfully!");
      setIsEditMode(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData)
    return <LoadingSpinner size="lg" message="Loading Profile..." />;
  if (!profileData)
    return (
      <p className="text-center text-red-500 text-xl py-10">
        Could not load profile data.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {isEditMode ? (
          <form onSubmit={handleUpdateSubmit} className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-purple-700 text-center">
              Edit Your Profile
            </h2>
            <div className="flex flex-col items-center space-y-3">
              <label
                htmlFor="profilePictureInput"
                className="cursor-pointer group relative"
              >
                {profilePicturePreview ? (
                  <img
                    src={profilePicturePreview}
                    alt="Profile Preview"
                    className="h-28 w-28 rounded-full object-cover shadow-lg border-4 border-white"
                  />
                ) : (
                  <UserCircle className="h-28 w-28 text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity">
                  <Upload className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </label>
              <input
                type="file"
                id="profilePictureInput"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </div>

            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <Input
              label="Country"
              name="country"
              placeholder="e.g., USA, Canada"
              value={formData.country}
              onChange={handleInputChange}
            />
            <Input
              label="Description"
              type="textarea"
              name="description"
              placeholder="Tell us about yourself..."
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditMode(false)}
                disabled={loading}
              >
                <XCircle className="w-5 h-5 mr-2" /> Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-48 w-full object-cover md:w-48 md:h-full"
                  src={
                    profileData.profilePicture ||
                    `https://placehold.co/300x300/A020F0/FFFFFF?text=${profileData.username
                      .charAt(0)
                      .toUpperCase()}`
                  }
                  alt={`${profileData.username}'s profile`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/300x300/cccccc/333333?text=Error`;
                  }}
                />
              </div>
              <div className="p-8 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="uppercase tracking-wide text-sm text-purple-600 font-semibold">
                      {profileData.role}
                    </div>
                    <h1 className="block mt-1 text-3xl leading-tight font-bold text-black">
                      {profileData.username}
                    </h1>
                    <p className="mt-2 text-gray-500">{profileData.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="!p-2"
                    onClick={() => setIsEditMode(true)}
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </div>
                {profileData.description && (
                  <p className="mt-4 text-gray-600">
                    {profileData.description}
                  </p>
                )}
                {profileData.country && (
                  <p className="mt-1 text-sm text-gray-500">
                    Country: {profileData.country}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 px-8 py-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Account Information
              </h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Verified
                  </dt>
                  <dd
                    className={`mt-1 text-sm ${
                      profileData.isVerified
                        ? "text-green-600 font-semibold"
                        : "text-red-600"
                    }`}
                  >
                    {profileData.isVerified ? "Yes" : "No"}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Member Since
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(profileData.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
