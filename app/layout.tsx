import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindEd Connections — Psychological Evaluations in Menifee, CA",
  description: "Comprehensive psychological and educational evaluations for children, teens, and adults. Michelle Hernandez, LEP, Ed.S. specializes in ADHD, autism, learning disabilities, and IEP/504 advocacy in Menifee, CA, with telehealth available throughout California.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;1,14..32,300;1,14..32,400;1,14..32,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
