// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "../components/ui/sonner";
import { NavbarWrapper } from "./NavbarWrapper"; // new component
import { AuthProvider } from "./context/AuthContext";
import { PlaidProvider } from "./context/PlaidContext";
import { TransactionProvider } from "./context/TransactionsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <PlaidProvider>
            <TransactionProvider>
              <NavbarWrapper />
              {children}
              <Toaster richColors toastOptions={{ style: { zIndex: 9999 } }} />
            </TransactionProvider>
          </PlaidProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
