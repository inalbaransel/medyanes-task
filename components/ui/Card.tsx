import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`backdrop-blur-md bg-neutral-900/60 border border-white/5 shadow-2xl shadow-black rounded-3xl p-8 ${className}`}
    >
      {children}
    </div>
  );
};
