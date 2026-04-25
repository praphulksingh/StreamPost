import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../services/auth.service";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);
    
    // We must use FormData because of the file uploads
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("username", data.username);
    formData.append("password", data.password);
    
    // Append files - checking if they exist first
    if (data.avatar && data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
    }
    if (data.coverImage && data.coverImage[0]) {
        formData.append("coverImage", data.coverImage[0]);
    }

    try {
      await authService.register(formData);
      // On success, redirect to login page
      navigate("/login"); 
    } catch (error) {
      setServerError(error.response?.data?.message || "Registration failed. Please check your inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4 py-12">
      <div className="w-full max-w-md bg-[#181818] p-8 rounded-2xl border border-brand-secondary shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
          <p className="text-brand-muted text-sm">Join ChaiTube today</p>
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center mb-6">
            {serverError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-text text-sm font-medium mb-1">Full Name</label>
              <input
                {...register("fullName", { required: "Required" })}
                className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 focus:outline-none focus:border-brand-accent text-white"
              />
            </div>
            <div>
              <label className="block text-brand-text text-sm font-medium mb-1">Username</label>
              <input
                {...register("username", { required: "Required" })}
                className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 focus:outline-none focus:border-brand-accent text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-brand-text text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Required" })}
              className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 focus:outline-none focus:border-brand-accent text-white"
            />
          </div>

          <div>
            <label className="block text-brand-text text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password", { required: "Required", minLength: 6 })}
              className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 focus:outline-none focus:border-brand-accent text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
             <div>
               <label className="block text-brand-text text-xs font-medium mb-1">Avatar (Required)</label>
               <input
                 type="file"
                 accept="image/*"
                 {...register("avatar", { required: "Avatar is required" })}
                 className="w-full text-xs text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-secondary file:text-white hover:file:bg-brand-accent"
               />
             </div>
             <div>
               <label className="block text-brand-text text-xs font-medium mb-1">Cover Image</label>
               <input
                 type="file"
                 accept="image/*"
                 {...register("coverImage")}
                 className="w-full text-xs text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-secondary file:text-white hover:file:bg-brand-accent"
               />
             </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-accent hover:bg-opacity-90 text-white font-bold py-3 rounded-lg transition-all mt-6 disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-brand-muted text-sm mt-6">
          Already have an account? <Link to="/login" className="text-brand-accent hover:text-white transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;