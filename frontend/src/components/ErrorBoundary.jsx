import { Component } from "react";
import { FiAlertTriangle } from "react-icons/fi";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4">
          <FiAlertTriangle className="text-6xl text-brand-accent mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong.</h1>
          <p className="text-brand-muted mb-6 max-w-md">
            We're having trouble loading this part of the application. Try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-brand-secondary hover:bg-white/10 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;