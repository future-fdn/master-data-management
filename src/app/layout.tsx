import "@/styles/globals.css";

import { Inter, Noto_Sans_Thai } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-thai",
  display: "swap",
});

export const metadata = {
  title: "MDM | Master Data Management",
  description: "master data management website",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoSansThai.variable} h-screen w-screen`}
      >
        {children}
      </body>
    </html>
  );
}
