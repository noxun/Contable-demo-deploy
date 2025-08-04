"use client";

import { Input } from "@/components/ui/input";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { forwardRef, InputHTMLAttributes, useState } from "react";

const PasswordInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  function handleClick() {
    setIsVisible(!isVisible);
  }

  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        className="text-black bg-white/30 backdrop-blur-md mt-2 mb-4 rounded-xl focus:outline-none focus-visible:ring-0"
        placeholder="Contraseña"
        type={isVisible ? "text" : "password"}
      />
      {isVisible ? (
        <EyeClosedIcon onClick={handleClick} className="text-cyan-900 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer" />
      ) : (
        <EyeIcon onClick={handleClick} className="text-cyan-900 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer" />
      )}
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
