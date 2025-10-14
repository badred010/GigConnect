import { useState } from "react";
import { toast } from "react-hot-toast";
import { ShoppingBag, UserCircle, UploadCloud } from "lucide-react";
import apiService from "../services/apiService";
import useAuthStore from "../store/authStore";
import Button from "../components/Button";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";
import { countryList } from "../data/countries";

const RegisterPage = ({ navigate }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [country, setCountry] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file is too large. Max 2MB allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!country) {
      toast.error("Please select your country.");
      return;
    }
    setLoading(true);
    try {
      const registrationData = {
        username,
        email,
        password,
        role,
        country,
      };

      if (profilePicture) {
        registrationData.profilePicture = profilePicture;
      }
      const userData = await apiService.register(registrationData);
      login(userData);
      toast.success("Registration successful! Welcome!");
      navigate("home");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <div className="flex items-center justify-center group mb-4">
            <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-400 group-hover:animate-pulse" />
            <span className="ml-3 text-3xl sm:text-4xl font-bold tracking-wider text-purple-600 group-hover:text-yellow-300 transition-colors">
              GigConnect
            </span>
          </div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Create your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("login")}
              className="font-medium text-purple-600 hover:text-purple-500 cursor-pointer focus:outline-none"
            >
              Sign in
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center space-y-3">
            <label htmlFor="profilePictureInput" className="cursor-pointer">
              {profilePicturePreview ? (
                <img
                  src={profilePicturePreview}
                  alt="Profile Preview"
                  className="h-24 w-24 rounded-full object-cover shadow-md border-2 border-purple-200"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
                  <UserCircle size={48} />
                </div>
              )}
            </label>
            <input
              type="file"
              id="profilePictureInput"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleProfilePictureChange}
              className="sr-only"
            />
            <label
              htmlFor="profilePictureInput"
              className="text-sm font-medium text-purple-600 hover:text-purple-500 cursor-pointer flex items-center"
            >
              <UploadCloud size={18} className="mr-2" />
              {profilePicturePreview
                ? "Change Photo"
                : "Upload Photo (Optional)"}
            </label>
          </div>

          <Input
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your Name"
            required
          />
          <Input
            label="Email address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country<span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg shadow-sm"
            >
              <option value="">Select your country</option>
              {countryList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="•••••••• (min. 6 characters)"
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              I want to:
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg shadow-sm"
            >
              <option value="buyer">Buy Services</option>
              <option value="seller">Sell Services</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full text-lg py-3"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
};
export default RegisterPage;
