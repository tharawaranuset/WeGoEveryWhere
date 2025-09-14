"use client";
import * as React from "react";
import { Upload, X } from "lucide-react";

type Props = {
  name?: string; // ชื่อฟิลด์ในฟอร์ม (สำคัญ!)
  value?: string | null;
  onChange?: (file: File | null, previewUrl: string | null) => void;
  size?: number; // px (สี่เหลี่ยมจัตุรัส)
  rounded?: "full" | "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "none";
  accept?: string;
  caption?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function PhotoPicker({
  name = "photo",
  value = null,
  onChange,
  size = 112,
  rounded = "full",
  accept = "image/*",
  caption = "Upload your profile photo",
  required = false,
  disabled = false,
  className = "",
}: Props) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [localUrl, setLocalUrl] = React.useState<string | null>(null);

  const roundedClass =
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

  React.useEffect(
    () => () => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    },
    [localUrl]
  );

  const clearPhoto = () => {
    setLocalUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileRef.current) fileRef.current.value = "";
    onChange?.(null, null);
  };

  const displayUrl = localUrl || value || null;

  return (
    <div className={`w-fit mx-auto flex flex-col items-center ${className}`}>
      <div
        className={`relative overflow-hidden bg-gray-200 shadow ${roundedClass}`}
        style={{ width: size, height: size }}
      >
        <button
          type="button"
          onClick={openFile}
          aria-label="Upload photo"
          className="absolute inset-0 flex items-center justify-center
                     active:scale-95 transition
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          disabled={disabled}
        >
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <Upload className="text-gray-700" />
          )}
        </button>

        {displayUrl && !disabled && (
          <button
            type="button"
            onClick={clearPhoto}
            aria-label="Remove photo"
            className="absolute right-1 top-1 h-6 w-6 rounded-full bg-black/70 text-white
                       flex items-center justify-center hover:bg-black transition"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* input file จะถูกส่งไปกับฟอร์มเพราะมี name */}
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

      {caption && (
        <p className="mt-3 text-center text-sm font-semibold text-gray-500">
          {caption}
        </p>
      )}
    </div>
  );
}
