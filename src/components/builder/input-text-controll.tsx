import {
    Controller,
    type FieldValues,
    type Path,
    type UseFormReturn,
} from "react-hook-form";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type InputTextControllProps<TData extends FieldValues> = {
    form: UseFormReturn<TData>;
    id: Path<TData>;
    label?: string;
    placeholder?: string;
    required?: boolean;
};
const InputTextControll = <TData extends FieldValues>({
    form,
    id,
    label,
    placeholder,
    required = false,
}: InputTextControllProps<TData>) => {
    return (
        <Controller
            name={id}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                    <Input
                        {...field}
                        id={field.name}
                        placeholder={placeholder}
                        required={required}
                    />
                </Field>
            )}
        />
    );
};

export default InputTextControll;
