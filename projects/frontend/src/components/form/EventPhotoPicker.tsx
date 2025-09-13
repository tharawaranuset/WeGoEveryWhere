"use client";
import * as React from "react";
import { Image as ImageIcon, X } from "lucide-react";

export type EventPhotoPickerProps = {
  name?: string;
  value?: string | null;
  onChange?: (file: File | null, previewUrl: string | null) => void;
  size?: number; // ความสูงของกรอบ (ความกว้างใช้ auto)
  width?: number; // ความกว้าง (optional)
  rounded?: "full" | "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "none";
  accept?: string;
  caption?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  withBorder?: boolean;
  bgClassName?: string;
};

const roundedToClass = (rounded: EventPhotoPickerProps["rounded"]) =>
  rounded === "full"
    ? "rounded-full"
    : rounded === "3xl"
    ? "rounded-3xl"
    : rounded === "2xl"
    ? "rounded-2xl"
    : rounded === "xl"
    ? "rounded-xl"
    : rounded === "lg"
    ? "rounded-lg"
    : rounded === "md"
    ? "rounded-md"
    : rounded === "sm"
    ? "rounded-sm"
    : "rounded-none";

export default function EventPhotoPicker({
  name = "eventPhoto",
  value = null,
  onChange,
  size = 120, // ความสูง
  width = 280, // ความกว้าง
  rounded = "2xl",
  accept = "image/*",
  caption = "Add Image",
  required = false,
  disabled = false,
  className = "",
  withBorder = true,
  bgClassName = "bg-gray-300",
}: EventPhotoPickerProps) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [localUrl, setLocalUrl] = React.useState<string | null>(null);

  const roundedClass = roundedToClass(rounded);
  const displayUrl = localUrl || value || null;

  const openFile = () => !disabled && fileRef.current?.click();

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    const url = URL.createObjectURL(f);
    setLocalUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    onChange?.(f, url);
  };

  React.useEffect(() => {
    return () => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, [localUrl]);

  const clearPhoto = () => {
    setLocalUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileRef.current) fileRef.current.value = "";
    onChange?.(null, null);
  };

  return (
    <div className={`w-fit mx-auto flex flex-col items-center ${className}`}>
      <div
        className={[
          "relative overflow-hidden shadow-sm flex items-center justify-center",
          bgClassName,
          roundedClass,
          withBorder ? "border border-black/30" : "",
        ].join(" ")}
        style={{ width, height: size }}
      >
        <button
          type="button"
          onClick={openFile}
          aria-label="Upload event photo"
          disabled={disabled}
          className="absolute inset-0 flex items-center justify-center gap-2
                     text-sm font-semibold text-black opacity-80
                     active:scale-[0.98] transition
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Event photo preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <span>{caption}</span>
              <ImageIcon className="w-4 h-4" />
            </>
          )}
        </button>

        {displayUrl && !disabled && (
          <button
            type="button"
            onClick={clearPhoto}
            aria-label="Remove photo"
            className="absolute right-2 top-2 h-7 w-7 rounded-full bg-black/70 text-white
                       flex items-center justify-center hover:bg-black transition"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* input file */}
      <input
        ref={fileRef}
        name={name}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={onFileChange}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}
