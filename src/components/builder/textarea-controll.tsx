import {
	Controller,
	type FieldValues,
	type Path,
	type UseFormReturn,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

type TextareaControllProps<TData extends FieldValues> = {
	form: UseFormReturn<TData>;
	id: Path<TData>;
	label?: string;
	placeholder?: string;
	required?: boolean;
	rows?: number;
};

const TextareaControll = <TData extends FieldValues>({
	form,
	id,
	label,
	placeholder,
	required = false,
	rows = 3,
}: TextareaControllProps<TData>) => {
	return (
		<Controller
			name={id}
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
					<Textarea
						{...field}
						value={field.value ?? ""}
						id={field.name}
						placeholder={placeholder}
						required={required}
						rows={rows}
					/>
					<FieldError errors={[fieldState.error]} />
				</Field>
			)}
		/>
	);
};

export default TextareaControll;
