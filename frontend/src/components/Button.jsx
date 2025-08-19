import React from "react";
import { Link } from "react-router-dom";
import "../styles/modern.css";

const base =
  "btn inline-flex items-center justify-center rounded-md font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed";

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-5 py-3 text-lg",
};

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  success: "btn-success",
  danger: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
};

export default function Button({
  children,
  to,
  href,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...rest
}) {
  const classes = [
    base,
    sizes[size] || sizes.md,
    variants[variant] || variants.primary,
    fullWidth ? "w-full" : "",
    className,
  ]
    .join(" ")
    .trim();
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
