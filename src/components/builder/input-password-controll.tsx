import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";
import {
    Controller,
    type FieldValues,
    type Path,
    type UseFormReturn,
} from "react-hook-form";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type InputPasswordControllProps<TData extends FieldValues> = {
    form: UseFormReturn<TData>;
    id: Path<TData>;
    label?: string;
    required?: boolean;
};
const InputPasswordControll = <TData extends FieldValues>({
    form,
    id,
    label,
    required = false,
}: InputPasswordControllProps<TData>) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Controller
            name={id}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <div className="relative flex items-center">
                        <Input
                            {...field}
                            id={field.name}
                            type={showPassword ? "text" : "password"}
                            placeholder={label ? label : "Password"}
                            required={required}
                            className="pr-8"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 h-7 w-7 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <IconEye className="size-4 text-muted-foreground" />
                            ) : (
                                <IconEyeOff className="size-4 text-muted-foreground" />
                            )}
                        </Button>
                    </div>
                </Field>
            )}
        />
    );
};

export default InputPasswordControll;
