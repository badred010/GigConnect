const LoadingSpinner = ({ size = "md" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };
  return (
    <div
      className="flex justify-center items-center my-8"
      role="status"
      aria-live="polite"
    >
      <div
        className={`${sizes[size]} border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin`}
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
export default LoadingSpinner;
