import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import apiService from "../services/apiService";
import useAuthStore from "../store/authStore";
import Button from "../components/Button";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";

const LoginPage = ({
  navigate,
  from,
  fromId,
  price,
  deliveryTime,
  gigTitle,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await apiService.login({ email, password });
      login(userData);
      toast.success("Logged in successfully!");
      if (from) {
        navigate(from, {
          gigId: fromId,
          orderId: fromId,
          price,
          deliveryTime,
          gigTitle,
        });
      } else {
        navigate("home");
      }
    } catch (error) {
      toast.error(
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <ShoppingBag className="mx-auto h-16 w-auto text-purple-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              onClick={() => navigate("register")}
              className="font-medium text-purple-600 hover:text-purple-500 cursor-pointer"
            >
              create a new account
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full text-lg"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
