const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"; // MODIFIEZ rounded-lg ici

  const variants = {
    primary:
      "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
    secondary:
      "bg-yellow-400 hover:bg-yellow-500 text-purple-700 focus:ring-yellow-300",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
    outline:
      "bg-transparent hover:bg-purple-100 text-purple-600 border-2 border-purple-600 focus:ring-purple-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
