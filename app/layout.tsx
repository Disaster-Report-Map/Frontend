import "../styles/globals.css";
import "leaflet/dist/leaflet.css"; // Fixes the vertical line / missing map CSS issue
import React from "react";
import { Toaster } from "sonner";

export const metadata = {
  title: "Disaster Report Map (DRM)",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png", // Fallback for iOS bookmarks
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600/30">
        <>
          <Toaster
            position="top-center"
            theme="dark"
            duration={7000}
            icons={{
              success: <div className="hidden" />,
              error: <div className="hidden" />,
              info: <div className="hidden" />,
              warning: <div className="hidden" />,
            }}
            toastOptions={{
              classNames: {
                toast:
                  "group bg-transparent shadow-none border-0 flex justify-center !w-full pointer-events-auto",
                content:
                  "bg-black/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[40px] px-2 py-1.5 flex flex-col items-center w-[calc(100vw-32px)] sm:w-fit sm:max-w-[450px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border border-white/10 group-hover:rounded-[24px] cursor-default",
                title:
                  "font-bold text-[14px] sm:text-[15px] px-4 py-2 flex items-center gap-2.5 whitespace-nowrap overflow-hidden",
                description:
                  "toast-desc-animate text-white/80 text-sm text-center px-6 max-h-0 opacity-0 overflow-hidden leading-relaxed",
                icon: "!hidden",
              },
            }}
          />
          {children}
        </>
      </body>
    </html>
  );
}
