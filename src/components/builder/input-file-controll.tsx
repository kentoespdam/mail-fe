import {
	type FieldValues,
	type Path,
	type UseFormReturn,
} from "react-hook-form";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type InputFileControllProps<TData extends FieldValues> = {
	form: UseFormReturn<TData>;
	id: Path<TData>;
	label?: string;
	accept?: string;
};
const InputFileControll = <TData extends FieldValues>({
	form,
	id,
	label,
	accept,
}: InputFileControllProps<TData>) => {
	return (
		<Field>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Input
				id={id}
				type="file"
				accept={accept}
				{...form.register(id)}
			/>
		</Field>
	);
};

export default InputFileControll;
