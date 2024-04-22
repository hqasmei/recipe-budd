import "@/app/globals.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import { Open_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/app/_components/providers";
import { Header } from "@/app/_components/header/header";
import { ReactNode } from "react";
import { Footer } from "@/app/_components/footer";
import { SendEventOnLoad } from "@/components/send-event-on-load";
import { RightsReserved } from "./(landing)/_sections/reserved";

const fontSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: { default: "RecipeBudd", template: "%s | RecipeBudd" },
  description: "An app to help you saved recipes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SendEventOnLoad eventKey="user viewed app" />
        <Providers>
          <Toaster />
          <NextTopLoader />
          <div className="flex flex-col w-full">
            <Header />
            <div>{children}</div>
            <Footer />
            <RightsReserved />
          </div>
        </Providers>
      </body>
    </html>
  );
}
