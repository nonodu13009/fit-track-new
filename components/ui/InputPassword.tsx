"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { Input, InputProps } from "./Input";

export interface InputPasswordProps extends Omit<InputProps, "type"> {}

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={`pr-12 ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute bottom-0 right-3 top-0 my-auto flex h-10 items-center text-gray-400 transition-colors hover:text-white focus:outline-none"
          aria-label={
            showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeSlash size={20} weight="bold" />
          ) : (
            <Eye size={20} weight="bold" />
          )}
        </button>
      </div>
    );
  }
);

InputPassword.displayName = "InputPassword";
