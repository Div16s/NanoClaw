import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NanoClaw - AI Executive Assistant",
  description: "Your autonomous AI assistant for email and calendar management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ theme: shadcn }}>
      <html lang="en">
        <body className={`${montserrat.className} antialiased`}>
          {children}
          <footer className="footer-wrapper">
            <div className="section-heading">
              <p className="text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} NanoClaw. All rights reserved.
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
