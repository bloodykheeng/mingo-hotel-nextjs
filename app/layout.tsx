import type { Metadata } from "next";
import "./globals.css";
// import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/themes/lara-light-amber/theme.css";


import { ThemeProvider } from '@/providers/ThemeProvider'
import PrimeReactProvider from "@/providers/PrimeReactProvider"
import { PrimeReactToastProvider } from "@/providers/PrimeReactToastProvider"
import TanstackProvider from "@/providers/TanstackProvider"
import { AuthProvider } from "@/providers/AuthProvider"
import { SidebarProvider } from "@/providers/SidebarContextProvider"

import { cookies } from "next/headers";
import NextJsProgressBar from '@/utils/NextJsProgressBar'

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: "Mingo Hotel Kayunga Ltd | %s",
  description:
    "Mingo Hotel Kayunga Ltd is a charming 2-star hotel located in the heart of Kayunga, Uganda. Blending modern comfort with local warmth, the hotel offers cozy rooms, exceptional dining, and convenient access to top attractions like Mehta Golf Club and the Source of the Nile.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const getCookie = async () => {
    const cookieStore = await cookies()
    return cookieStore.get("theme")
  }

  const defaultTheme = getCookie();

  return (
    <html lang="en">
      <head>
        <link id="theme-link" rel="stylesheet" href="/themes/lara-light-amber/theme.css" />
      </head>
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <NextJsProgressBar />
        <ThemeProvider defaultTheme={defaultTheme}>
          <PrimeReactProvider>
            <PrimeReactToastProvider>
              <TanstackProvider>
                <AuthProvider>
                  <SidebarProvider>

                    {children}

                  </SidebarProvider>
                </AuthProvider>
              </TanstackProvider>
            </PrimeReactToastProvider>
          </PrimeReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
