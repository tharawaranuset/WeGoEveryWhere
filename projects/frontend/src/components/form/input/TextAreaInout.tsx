import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

type TextAreaFieldProps = {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  rows?: number;
};

export const TextAreaInput = (props: TextAreaFieldProps) => {
  const { name, label, defaultValue, placeholder, readOnly, className, rows } =
    props;
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="text-sm font-semibold block mb-1">
        {label}
      </Label>
      <div className="h-1" />
      <Textarea
        className={`${className} focus-visible:ring-offset-0 focus-visible:ring-1`}
        name={name}
        id={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        readOnly={readOnly}
        rows={rows ?? 4}
      />
    </div>
  );
};
