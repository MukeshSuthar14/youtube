import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouTube",
  description: "Video Straming Platform",
  authors: { name: "Mukesh Suthar" },
  keywords: "youtube",
  // themeColor: "red"
  icons: {
    icon: '/youtube.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
        {children}
      </body>
    </html>
  );
}
