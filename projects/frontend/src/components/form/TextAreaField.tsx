import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type TextAreaFieldProps = {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  readonly?: boolean;
  classname?: string;
  rows?: number;
};

export const TextAreaField = (props: TextAreaFieldProps) => {
  const { name, label, defaultValue, placeholder, readonly, classname, rows } =
    props;
  return (
    <div className="mb-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="h-1" />
      <Textarea
        className={classname}
        name={name}
        id={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        readOnly={readonly}
        rows={rows ?? 4}
      />
    </div>
  );
};
