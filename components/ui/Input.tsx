"use client";

import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const baseClasses =
      "w-full px-4 py-2 bg-surface border rounded-lg text-white placeholder:text-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const stateClasses = error
      ? "border-red-500 focus:ring-red-500/50"
      : "border-white/10 focus:border-accent-cyan focus:ring-accent-cyan/50";

    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseClasses} ${stateClasses} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
