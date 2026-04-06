"use client";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Logo } from "@/components/ui/logo";
import { useLogin } from "@/hooks/auth-hooks";
import InputPasswordControll from "../builder/input-password-controll";
import InputTextControll from "../builder/input-text-controll";

export const LoginForm = memo(() => {
	const { form, onSubmit, isPending } = useLogin();

	return (
		<Card className="overflow-hidden shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-sky-200/50 dark:border-sky-800/50 py-0">
			<CardContent className="grid p-0 md:grid-cols-5">
				{/* Branding Section */}
				<div className="relative flex md:col-span-2 flex-col items-center justify-center bg-linear-to-br from-sky-600 via-blue-700 to-sky-800 p-8 text-white overflow-hidden">
					{/* Floating bubbles */}
					{[0, 1, 2, 3].map((i) => (
						<div
							key={`bubble-${i}`}
							className="absolute rounded-full border border-white/20 bg-white/5 animate-float-bubble"
							style={{
								width: `${8 + i * 4}px`,
								height: `${8 + i * 4}px`,
								left: `${20 + i * 20}%`,
								bottom: "0%",
								animationDelay: `${i * 2}s`,
								willChange: "transform, opacity",
							}}
						/>
					))}

					<div className="relative z-10 flex flex-col items-center text-center space-y-6">
						{/* Logo with original SVG colors */}
						<div className="rounded-2xl bg-white/90 dark:bg-white/85 p-5 backdrop-blur-sm border border-white/40 shadow-xl shadow-black/15 animate-logo-bounce">
							<Logo
								width={100}
								height={72}
								priority
								className="drop-shadow-md"
							/>
						</div>

						{/* Title & tagline */}
						<div className="space-y-2">
							<h3 className="text-lg font-bold tracking-wide uppercase">
								Sistem Persuratan
							</h3>
						</div>

						{/* Footer info */}
						<div className="pt-2 border-t border-white/15 w-full text-center space-y-1">
							<p className="text-[11px] italic text-sky-100/80">
								"Melayani dengan SATRIA"
							</p>
							<p className="text-[10px] text-sky-200/60">
								Perumda Air Minum Tirta Satria — Kab. Banyumas
							</p>
						</div>
					</div>
				</div>

				{/* Login Form Section */}
				<div className="md:col-span-3 p-6 md:p-8 lg:p-10 animate-fade-in-left">
					<form
						id="auth-form"
						className="space-y-6"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<div className="space-y-2 text-center md:text-left">
							<h2 className="text-xl font-bold text-slate-900 dark:text-white">
								Masuk ke Akun Anda
							</h2>
							<p className="text-balance text-muted-foreground text-sm">
								Silakan masukkan kredensial Anda untuk mengakses sistem internal
							</p>
						</div>

						<FieldGroup className="space-y-5">
							<InputTextControll
								form={form}
								id="username"
								label="Username"
								placeholder="Username / NIPAM"
							/>
							<InputPasswordControll
								form={form}
								id="password"
								label="Password"
							/>

							<div className="animate-fade-in-scale">
								<Button
									type="submit"
									form="auth-form"
									disabled={isPending}
									className="w-full bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 dark:from-sky-500 dark:to-blue-500 text-white shadow-lg shadow-sky-500/20"
									size="lg"
								>
									{isPending ? (
										<span className="flex items-center gap-2">
											<span className="animate-spin">Processing...</span>
										</span>
									) : (
										"Masuk"
									)}
								</Button>
							</div>
						</FieldGroup>
					</form>
				</div>
			</CardContent>
		</Card>
	);
});

LoginForm.displayName = "LoginForm";
