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
		<Card className="overflow-hidden shadow-2xl backdrop-blur-sm bg-background/80 dark:bg-card/80 border-primary/20 dark:border-primary/10 py-0">
			<CardContent className="grid p-0 md:grid-cols-5">
				{/* Branding Section */}
				<div className="relative flex md:col-span-2 flex-col items-center justify-center bg-linear-to-br from-primary via-primary/90 to-primary/80 p-8 text-primary-foreground overflow-hidden">
					{/* Floating bubbles */}
					{[0, 1, 2, 3].map((i) => (
						<div
							key={`bubble-${i}`}
							className="absolute rounded-full border border-primary-foreground/20 bg-primary-foreground/5 animate-float-bubble"
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
							<h3 className="text-lg font-bold tracking-wide uppercase text-primary-foreground">
								Sistem Persuratan
							</h3>
						</div>

						{/* Footer info */}
						<div className="pt-2 border-t border-primary-foreground/15 w-full text-center space-y-1">
							<p className="text-[11px] italic text-primary-foreground/80">
								"Melayani dengan SATRIA"
							</p>
							<p className="text-[10px] text-primary-foreground/60">
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
							<h2 className="text-xl font-bold text-foreground">
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
									className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 dark:from-primary dark:to-primary/80 text-primary-foreground shadow-lg shadow-primary/20"
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
