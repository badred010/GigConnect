const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = "",
  ...props
}) => {
  const commonInputProps = {
    name,
    id: name,
    value,
    onChange,
    placeholder,
    required,
    className: `mt-1 block w-full px-4 py-3 border ${
      error ? "border-red-500" : "border-gray-300"
    } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
      error ? "focus:ring-red-500" : "focus:ring-purple-500"
    } focus:border-transparent sm:text-sm transition-colors text-gray-900 placeholder-gray-500`,
    ...props,
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {type === "textarea" ? (
        <textarea {...commonInputProps} />
      ) : (
        <input type={type} {...commonInputProps} />
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};
export default Input;
