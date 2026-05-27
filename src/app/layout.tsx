import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conference & Membership Portal",
  description:
    "Organization and event registration for research conferences, conventions, and forums",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
