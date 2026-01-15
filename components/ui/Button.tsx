import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost";
  children: React.ReactNode;
}

export const Button = ({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "transition-all duration-300 ease-out font-medium rounded-xl py-3.5 px-6 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

  let variantStyles = "";

  switch (variant) {
    case "primary":
      variantStyles =
        "bg-white text-black hover:bg-neutral-200 border border-transparent";
      break;
    case "danger":
      variantStyles =
        "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20";
      break;
    case "ghost":
      variantStyles =
        "bg-transparent hover:bg-white/5 text-white/90 border border-transparent";
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
