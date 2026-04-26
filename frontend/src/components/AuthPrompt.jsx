import { Link } from "react-router-dom";
import { FiLock } from "react-icons/fi";

const AuthPrompt = ({ 
  title = "Sign in required", 
  description = "Please sign in or create an account to view this page." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center px-4 w-full">
      <div className="bg-brand-secondary/30 p-6 rounded-full mb-6 border border-brand-secondary">
        <FiLock className="text-5xl text-brand-accent" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2">
        {title}
      </h2>
      
      <p className="text-brand-muted mb-8 max-w-md">
        {description}
      </p>
      
      <div className="flex gap-4">
        <Link 
          to="/login"
          className="bg-brand-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-colors"
        >
          Sign In
        </Link>
        <Link 
          to="/register"
          className="bg-transparent text-white px-6 py-2 rounded-full font-semibold hover:bg-white/10 transition-colors border border-brand-secondary"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default AuthPrompt;