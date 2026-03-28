import {
	Controller,
	type FieldValues,
	type Path,
	type UseFormReturn,
} from "react-hook-form";
import { Field, FieldLabel } from "../ui/field";

type CheckboxControllProps<TData extends FieldValues> = {
	form: UseFormReturn<TData>;
	id: Path<TData>;
	label?: string;
};
const CheckboxControll = <TData extends FieldValues>({
	form,
	id,
	label,
}: CheckboxControllProps<TData>) => {
	return (
		<Controller
			name={id}
			control={form.control}
			render={({ field }) => (
				<Field orientation="horizontal">
					<input
						type="checkbox"
						id={field.name}
						checked={field.value}
						onChange={field.onChange}
						onBlur={field.onBlur}
						ref={field.ref}
					/>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
				</Field>
			)}
		/>
	);
};

export default CheckboxControll;
