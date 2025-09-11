import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { read } from "fs";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  classname?: string;
  readonly?: boolean;
};

export const InputField = (props: FormInputProps) => {
  const { name, type, label, defaultValue, placeholder, readonly, classname } =
    props;
  return (
    <div className="mb-2">
      <Label htmlFor={name}> {label} </Label>
      <div className="h-1" />
      <Input
        className={classname}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        readOnly={readonly}
      />
    </div>
  );
};
