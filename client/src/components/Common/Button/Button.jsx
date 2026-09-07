import "./Button.css";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;