import React, { ButtonHTMLAttributes } from "react";
import InlinePreloader from "./InlinePreloader";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  // Base button classes
  const baseClasses =
    "btn font-medium transition-all duration-300 flex items-center justify-center gap-2";

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  // Variant classes
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    outline: "btn-outline",
  };

  // Width class
  const widthClass = fullWidth ? "w-full" : "";

  // Disabled class
  const disabledClass =
    disabled || isLoading ? "opacity-70 cursor-not-allowed" : "";

  // Spinner color based on variant
  const spinnerColor = variant === "outline" ? "primary" : "white";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <InlinePreloader
          size={size === "lg" ? "md" : size === "md" ? "sm" : "xs"}
          color={spinnerColor}
        />
      )}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
};

export default Button;
