import { useEffect, useMemo } from "react";
import { useRouter } from "nextjs-toploader/app";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import Cookies from "js-cookie";

const useHandleQueryError = (query: any) => {
  const { isError, error } = query;

  const primeReactToast = usePrimeReactToast();

  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Memoize the error object
  const memoizedError = useMemo(() => error, [error]);

  // Utility function to check online status
  const checkInternetConnection = () => {
    if (typeof navigator !== "undefined" && "onLine" in navigator) {
      return navigator.onLine;
    }
    return true; // Assume online if unsupported
  };

  useEffect(() => {
    if (!isError || !memoizedError) return; // Avoid unnecessary execution
    if (isError) {
      console.log("Error fetching List of data:", memoizedError);

      // Check if the user is offline
      const isOnline = checkInternetConnection();

      if (!isOnline) {
        primeReactToast.warn(
          "You are offline. Please check your internet connection."
        );
        return;
      }

      // Check for a 401 Unauthorized error with an "Unauthenticated." message
      if (
        memoizedError?.response?.status === 401 &&
        memoizedError?.response?.data?.message === "Unauthenticated."
      ) {
        // primeReactToast.warn("Session expired. Please log in again.");
        // queryClient.resetQueries({ queryKey: ["logged-in-user"] });
        // queryClient.removeQueries({ queryKey: ["logged-in-user"] });
        // queryClient.clear();

        // Clear cookies in case of error
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("profile");

        // Redirect to login page
        if (pathname?.startsWith("/dashboard")) {
          router.push("/");
        }
      } else if (memoizedError?.response?.data?.message) {
        primeReactToast.error(memoizedError.response.data.message);
      } else if (!memoizedError?.response) {
        primeReactToast.warn(
          "Unable to connect to the server. Please check your internet connection or contact the administrator."
        );
      } else {
        primeReactToast.error("An error occurred. Please contact admin.");
      }
    }
  }, [isError, error]);

  return;
};

export default useHandleQueryError;
