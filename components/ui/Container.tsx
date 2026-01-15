import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-black ${className}`}
    >
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-900/50 via-black to-black"></div>

      <div className="w-full max-w-3xl relative z-10">{children}</div>
    </div>
  );
};
