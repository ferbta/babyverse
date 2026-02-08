import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "BabyVerse - Quản lý thông tin con yêu",
  description: "Hệ thống quản lý toàn diện thông tin sức khỏe và phát triển của trẻ từ sơ sinh đến tuổi đi học",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
