"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { useLogin } from "@/hooks/auth-hooks";
import { cn } from "@/lib/utils";
import InputPasswordControll from "../builder/input-password-controll";
import InputTextControll from "../builder/input-text-controll";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { form, onSubmit, isPending } = useLogin();
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form id="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<InputTextControll
								form={form}
								id="username"
								label="Username"
								placeholder="Username / Nipam"
							/>
							<InputPasswordControll form={form} id="password" />
							<Field>
								<Button type="submit" form="auth-form"
									disabled={isPending}>Login</Button>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
