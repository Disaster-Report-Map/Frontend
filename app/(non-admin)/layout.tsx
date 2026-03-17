import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

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
    <>
      <Header />
      <main className="flex-1 flex flex-col w-full relative z-[1]">
        {children}
      </main>
      <Footer />
    </>
  );
}
