"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

type BtnSize = "default" | "lg" | "sm";

type SubmitButtonProps = {
  className?: string;
  size?: BtnSize;
  text?: string;
  type?: "submit" | "button" | "reset"; // เพิ่ม
  onclick?: React.MouseEventHandler<HTMLButtonElement>; // เพิ่ม
};

export const SubmitButton = ({
  className,
  size,
  text,
  type = "submit",
  onclick,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  const isSubmit = type === "submit";

  return (
    <Button
      type={type}
      size={size}
      onClick={onclick} // ส่งต่อ onClick
      disabled={isSubmit ? pending : false}
      className={`${className} capitalize`}
    >
      {isSubmit && pending ? (
        <>
          <RotateCw className="animate-spin" />
          <span>Please wait...</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </Button>
  );
};
