import {
	Controller,
	type FieldValues,
	type Path,
	type UseFormReturn,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export interface SelectOption {
	value: string | number;
	label: string;
}

type SelectControllProps<TData extends FieldValues> = {
	form: UseFormReturn<TData>;
	id: Path<TData>;
	label?: string;
	placeholder?: string;
	required?: boolean;
	options: SelectOption[];
};

const SelectControll = <TData extends FieldValues>({
	form,
	id,
	label,
	placeholder = "Pilih...",
	required = false,
	options,
}: SelectControllProps<TData>) => {
	return (
		<Controller
			name={id}
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					{label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
					<Select
						value={field.value ?? null}
						onValueChange={(val) => field.onChange(val)}
						required={required}
					>
						<SelectTrigger
							className="w-full h-9 text-sm"
							aria-invalid={fieldState.invalid}
						>
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						<SelectContent>
							{options.map((opt) => (
								<SelectItem key={opt.value} value={opt.value}>
									{opt.value} - {opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FieldError errors={[fieldState.error]} />
				</Field>
			)}
		/>
	);
};

export default SelectControll;
