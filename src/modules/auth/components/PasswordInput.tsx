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
    <div className="flex justify-evenly items-center">
      <Input
        {...props}
        ref={ref}
        className="w-auto flex-auto"
        placeholder="Contraseña"
        type={isVisible ? "text" : "password"}
      />
      {isVisible ? (
        <EyeClosedIcon onClick={handleClick} className="flex-1" />
      ) : (
        <EyeIcon onClick={handleClick} className="flex-1" />
      )}
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
