import React from "react";
import type { Metadata } from "next";
import { Poppins as FontSans } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation/Navigation";
import { ThemeModeScript, Flowbite } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

const MusicPlayer = dynamic(
  () => import("@/components/music_player/musicPlayer"),
  { ssr: false }
);

const fontSans = FontSans({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RekoMix",
  description: "AI-powered music recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={`min-h-screen dark:bg-gray-900 font-sans antialiased w-full ${fontSans.variable}`}>
        <Flowbite>
          <Navigation />
          {children}
          <ToastContainer
            position={"bottom-right"}
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <MusicPlayer />
        </Flowbite>
      </body>
    </html>
  );
}
