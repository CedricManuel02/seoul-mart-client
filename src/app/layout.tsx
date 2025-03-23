import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import NavigationBar from "@/_components/shared/navigation-bar/navigation-bar";
import NavigationLinkContainer from "@/_components/shared/sub-navigation-link/navigation-link-container";
import { ReduxProvider } from "@/_redux/provider";
import Footer from "@/_components/shared/footer/footer";
import SessionProvider from "./api/auth/[...nextauth]/provider/session-provider";
export const metadata: Metadata = {
  title: "Bella and Pepper Korean Store",
  description: "",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ReduxProvider>
            <NavigationBar />
            <NavigationLinkContainer />
            {children}
            <Toaster />
            <Footer />
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
