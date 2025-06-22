"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useRouter } from 'nextjs-toploader/app';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";

import { postTologin } from "@/services/auth/auth-service";
import useHandleMutationError from "@/hooks/useHandleMutationError";
import OtpDiaglog from "./OtpDiaglog";
import Link from "next/link";

import Image from "next/image";

const loginSchema = z.object({
    // email: z.string().email("Invalid email address"),
    email: z.string().refine((value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+\d{3}\d{3}\d{3}\d{3}$/; // Matches +256123123123 format

        return emailRegex.test(value) || phoneRegex.test(value);
    }, "Invalid email or phone number. Please use a valid email or phone number format (e.g., test@example.com or +256123123123)."),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    rememberMe: z.boolean().optional(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginPagePropTypes {
    returnPath?: string
}

const LoginPage = ({ returnPath }: LoginPagePropTypes) => {



    const router = useRouter();
    const queryClient = useQueryClient();
    // const router = useRouter();
    const primeReactToast = usePrimeReactToast();
    const [checked, setChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showOTPDialog, setShowOTPDialog] = useState(false);
    const [loginDetails, setLoginDetails] = useState<LoginFormInputs | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors, isSubmitting },

    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: { rememberMe: false }
    });

    const password = watch("password")
    console.log("🚀 ~ LoginPage ~ password :", password)

    console.log("🚀 ~ LoginPage ~ errors:", errors)
    const rememberMe = watch("rememberMe");

    const loginMutation = useMutation({
        mutationFn: (variables: LoginFormInputs) => postTologin(variables),
        onSuccess: (data) => {
            console.log("🚀 ~ LoginPage ~ data:", data)
            setIsLoading(false);

            setLoginDetails((prev) => ({
                ...prev, // Preserve existing state
                email: data?.data?.email ?? "", // Ensure email is a string
                password: prev?.password ?? "", // Ensure password is always defined
            }));

            queryClient.invalidateQueries();
            queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });


            // 🔁 Redirect back to original page or home
            if (returnPath) {
                const decoded = decodeURIComponent(returnPath);
                console.log("🚀 ~ LoginPage ~ decoded:", decoded)
                const pathname = new URL(decoded, window.location.origin).pathname;
                console.log("🚀 ~ LoginPage ~ pathname:", pathname)

                const allowedReturnPaths = ['/rooms/view/'];
                if (allowedReturnPaths.includes(pathname)) {
                    router.push(decoded);
                    return;
                }
            }

            router.push('/');

            // setShowOTPDialog(true);
        },
    });

    useHandleMutationError(loginMutation?.error);

    const onSubmit = (data: LoginFormInputs) => {
        setIsLoading(true);
        setLoginDetails(data);
        loginMutation.mutate(data);
    };

    return (
        <>

            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="w-full sm:w-96 md:w-[28rem] lg:w-[32rem] shadow-lg rounded-lg bg-white dark:bg-gray-800 p-6">
                    <div className="text-center mb-6">
                        <Image
                            src="/mingo-hotel-logo/mongo-no-bg.png"
                            alt="logo"
                            width={140}
                            height={30}
                            style={{ height: "40px", width: "auto" }}
                            className="w-full dark:hidden"
                        />
                        <Image
                            src="/mingo-hotel-logo/mongo-no-bg.png"
                            alt="logo"
                            width={140}
                            height={30}
                            style={{ height: "40px", width: "auto" }}
                            className="hidden w-full dark:block"
                        />
                        <h2 className="text-gray-900 dark:text-gray-100 text-3xl font-semibold mb-2">Login</h2>
                        <p className="text-gray-600 text-sm">
                            Don't have an account?
                            <Link href="/register" className="ml-2 text-blue-500 hover:underline">
                                Register please!
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Email Field */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-100 mb-2">
                                Email
                            </label>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <InputText
                                        id="email"
                                        type="text"
                                        placeholder="Email address"
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "p-invalid" : ""}`}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.email && <small className="text-red-500">{errors.email.message}</small>}
                        </div>

                        {/* Password Field */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-100 mb-2">
                                Password
                            </label>
                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Password
                                        id="password"
                                        placeholder="Password"
                                        toggleMask
                                        feedback={false}
                                        invalid={!!errors.password}
                                        className={`w-full`}
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        value={field.value || ""}
                                        pt={{
                                            iconField: {
                                                root: {
                                                    style: { width: "100%", },

                                                },
                                                style: { width: "100%", },
                                            },
                                            input: {
                                                style: { width: "100%", },
                                            },
                                            root: {
                                                style: { width: "100%" },
                                            },
                                            showIcon: { style: { right: "0.2rem", } },
                                            hideIcon: { style: { right: "0.2rem", } },
                                        }}
                                    />
                                )}
                            />
                            {errors.password && <small className="text-red-500">{errors.password.message}</small>}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <Checkbox
                                    id="rememberme"
                                    onChange={(e) => setChecked(!!e.checked)}
                                    checked={checked}
                                    className="mr-2"
                                />
                                <label htmlFor="rememberme" className="text-gray-700 dark:text-gray-100 text-sm">
                                    Remember me
                                </label>
                            </div>
                            <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                                Forgot your password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            label="Login"
                            icon={loginMutation?.isPending ? "pi pi-spin pi-spinner" : "pi pi-user"}
                            className="w-full py-3 text-lg"
                            disabled={loginMutation?.isPending}
                        />

                        <div className="text-center mt-6">
                            <Link href="/" className="text-blue-500 hover:underline">
                                Back to Home
                            </Link>
                        </div>
                    </form>
                </div>
            </div>






            {/* <OtpDiaglog setShowOTPDialog={setShowOTPDialog} showOTPDialog={showOTPDialog} loginDetails={loginDetails} setLoginDetails={setLoginDetails} /> */}
        </>
    );
};

export default LoginPage;
