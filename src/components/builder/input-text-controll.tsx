import type { Icon } from "@tabler/icons-react";
import {
	Controller,
	type FieldValues,
	type Path,
	type UseFormReturn,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type InputTextControllProps<TData extends FieldValues> = {
	form: UseFormReturn<TData>;
	id: Path<TData>;
	label?: string;
	placeholder?: string;
	required?: boolean;
	icon?: Icon;
};
const InputTextControll = <TData extends FieldValues>({
	form,
	id,
	label,
	placeholder,
	required = false,
	icon: Icon,
}: InputTextControllProps<TData>) => {
	return (
		<Controller
			name={id}
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
					<div className="relative">
						<Input
							{...field}
							id={field.name}
							placeholder={placeholder}
							required={required}
							className={Icon ? "pl-9" : undefined}
						/>
						{Icon && (
							<Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
						)}
					</div>
					<FieldError errors={[fieldState.error]} />
				</Field>
			)}
		/>
	);
};

export default InputTextControll;
