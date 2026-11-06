import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "SYS.PG // 隐私数据防护中枢",
  description: "高级个人隐私数据拦截与策略配置平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
