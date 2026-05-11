import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minded Connections — Child & Adolescent Psychiatry",
  description: "Evidence-based psychiatric care for children and teens ages 4-18. Dr. Michelle Hernandez, MD offers evaluations, therapy, and medication management in Corona, CA.",
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
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400&family=DM+Sans:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap"
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
