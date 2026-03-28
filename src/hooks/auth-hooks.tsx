import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { doLogin, logout } from "@/actions/auth";
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

	const { mutate, isPending } = useMutation({
		mutationFn: doLogin,
		onSuccess: (data) => {
			if (!data.success) throw new Error("Login Failed");
			toast.info("Login Success");
			router.push("/persuratan");
		},
		onError: (error) => {
			console.log(error);
			toast.error(error.message || "Login Failed");
		},
	});

	const onSubmit = (values: LoginSchema) => mutate(values);

	return { form, onSubmit, isPending };
};

export const useLogout = () => {
	const router = useRouter();

	const { mutate, isPending } = useMutation({
		mutationFn: logout,
		onSuccess: () => {
			toast.info("Anda telah keluar");
			router.push("/login");
		},
		onError: (error) => {
			console.log(error);
			toast.error(error.message || "Gagal keluar");
		},
	});

	return { logout: mutate, isPending };
};
