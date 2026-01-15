import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Input = (props: InputProps) => {
  return (
    <input
      {...props}
      className={`w-full bg-neutral-900/80 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-neutral-500 focus:outline-none focus:bg-black focus:border-white/20 transition-all duration-300 text-[15px] ${
        props.className || ""
      }`}
    />
  );
};

export const TextArea = (props: TextAreaProps) => {
  return (
    <textarea
      {...props}
      className={`w-full bg-neutral-900/80 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-neutral-500 focus:outline-none focus:bg-black focus:border-white/20 transition-all duration-300 text-[15px] ${
        props.className || ""
      }`}
    />
  );
};
