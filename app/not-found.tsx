"use client"; // Required for useRouter in App Router
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const NotFound = () => {
    const router = useRouter();

    return (

        <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
            <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 md:p-12">
                {/* Logo - Light/Dark Mode */}
                <Image
                    src="/mingo-hotel-logo/mongo-no-bg.png"
                    alt="PPDA Logo"
                    width={140}
                    height={30}
                    className="w-auto h-10 dark:hidden"
                />
                <Image
                    src="/mingo-hotel-logo/mongo-no-bg.png"
                    alt="PPDA Logo"
                    width={140}
                    height={30}
                    className="hidden dark:block w-auto h-10"
                />

                {/* Error Code */}
                <span className="text-brand-500 dark:text-brand-600 text-4xl font-extrabold">404</span>
                <h1 className="text-gray-900 dark:text-gray-100 text-3xl md:text-5xl font-bold mt-2">
                    Page Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg text-center">
                    The requested resource is not available.
                </p>

                {/* Home Button */}
                <Link
                    href="/"
                    className="mt-6 flex w-full max-w-sm items-center space-x-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 p-4 transition hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500">
                        <i className="pi pi-home text-white text-2xl"></i>
                    </div>
                    <div>
                        <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">Home</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Go back to the homepage</p>
                    </div>
                </Link>

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mt-4 flex w-full max-w-sm items-center space-x-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 p-4 transition hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500">
                        <i className="pi pi-angle-double-left text-white text-2xl"></i>
                    </div>
                    <div>
                        <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">Go Back</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Return to the previous page</p>
                    </div>
                </button>
            </div>
        </div>


    );
};

export default NotFound;
