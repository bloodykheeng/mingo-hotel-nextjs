"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "nextjs-toploader/app";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";

import Cookies from "js-cookie";

interface ApiErrorResponse {
  response: {
    status?: string;
    data?: {
      message?: string;
      error?: string;
    };
  };
}

const useHandleMutationError = (error: ApiErrorResponse | Error | null) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const primeReactToast = usePrimeReactToast();

  // Memoize the error object
  const memoizedError = useMemo(() => error, [error]);

  console.log("🚀 ~ useHandleMutationError ~ error:", error);

  // Utility function to check online status
  const checkInternetConnection = () => {
    if (typeof navigator !== "undefined" && "onLine" in navigator) {
      return navigator.onLine;
    }
    return true; // Assume online if unsupported
  };

  useEffect(() => {
    if (memoizedError) {
      const errorMessage = (memoizedError as ApiErrorResponse)?.response?.data
        ?.message;

      // Check if the user is offline
      const isOnline = checkInternetConnection();

      if (!isOnline) {
        primeReactToast.warn(
          "You are offline. Please check your internet connection."
        );
        return;
      }

      if (errorMessage) {
        if (errorMessage === "Unauthenticated.") {
          // primeReactToast.warn("Session expired. Please log in again.");
          queryClient.resetQueries({ queryKey: ["logged-in-user"] });
          queryClient.removeQueries({ queryKey: ["logged-in-user"] });
          queryClient.clear();

          // Clear cookies in case of error
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          Cookies.remove("profile");

          if (pathname?.startsWith("/dashboard")) {
            router.push("/");
          }
        } else {
          const additionalError = (memoizedError as ApiErrorResponse)?.response
            ?.data?.error
            ? `Error: ${
                (memoizedError as ApiErrorResponse)?.response?.data?.error
              }`
            : "";
          primeReactToast.error(`${errorMessage} ${additionalError}`);
        }
      } else if (!(memoizedError as ApiErrorResponse)?.response) {
        primeReactToast.warn(
          "Unable to connect to the server. Please check your internet connection or contact the administrator."
        );
      } else {
        primeReactToast.error("An error occurred. Please contact admin.");
      }
    }
  }, [memoizedError]);
};

export default useHandleMutationError;
