import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      login(response.data.user);
      navigate("/"); // Redirect to home on success
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
      <div className="w-full max-w-md bg-[#181818] p-8 rounded-2xl border border-brand-secondary shadow-xl">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-brand-accent flex justify-center mb-4">▶ ChaiTube</Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-brand-muted text-sm">Sign in to your account</p>
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center mb-6">
            {serverError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-brand-text text-sm font-medium mb-1">Email or Username</label>
            <input
              {...register("email", { required: "Email or Username is required" })}
              className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-3 focus:outline-none focus:border-brand-accent transition-colors text-white"
              placeholder="Enter email or username"
            />
            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-brand-text text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-3 focus:outline-none focus:border-brand-accent transition-colors text-white"
              placeholder="Enter your password"
            />
            {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-accent hover:bg-opacity-90 text-white font-bold py-3 rounded-lg transition-all mt-4 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-brand-muted text-sm mt-8">
          Don't have an account? <Link to="/register" className="text-brand-accent hover:text-white transition-colors">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;