import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { doLogin } from "@/app/login/action";
import { isEmailValid } from "@/lib/email-validator";
import { LoginSchema } from "@/types/auth";

export const useLogin = () => {
	const router = useRouter();

	const form = useForm<LoginSchema>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const { mutate, isPending, error } = useMutation({
		mutationFn: doLogin,
		onSuccess: (data) => {
			if (!data.success) throw new Error("Login Failed");
			toast.info("Login Success");
			router.push("/");
		},
		onError: (error) => {
			console.log(error);
			toast.error(error.message || "Login Failed");
		},
	});

	const onSubmit = (values: LoginSchema) => mutate(values)

	return { form, onSubmit, isPending };
};
