import { useState } from 'react';
import { useController } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeClosedIcon } from 'lucide-react';

import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';

interface TextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  placeholder?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

const TextField = <T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  rules,
}: TextFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController<T>({ name, control, rules });

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="flex flex-col  relative">
      {label && (
        <Label htmlFor={name} className="font-normal text-sm text-zinc-950 mb-2  block">
          {label}
        </Label>
      )}

      <div className="relative">
        <Input
          id={name}
          {...field}
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          className={`border-zinc-200 font-normal  placeholder:text-[#71717A] w-full border rounded-md px-3 py-2 text-sm outline-none transition pr-10 ${
            error ? 'border-red-500' : 'border-gray-300 focus:border-[#4F61E8]'
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <Eye size={16} /> : <EyeClosedIcon size={16} />}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  );
};

export default TextField;
