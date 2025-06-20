import type { Metadata } from "next";
import { MedievalSharp } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ThemeProvider from "@/contexts/theme/ThemeProvider";

const metadataBase = new URL(
  process.env.NEXT_PUBLIC_METADATA_BASE_URL || "http://localhost:3000"
);

export const metadata: Metadata = {
  metadataBase: metadataBase,

  title: {
    template: "Typescript Guard",
    default: "Type Guard: A TypeScript Quiz Game",
  },

  description:
    "Test your TypeScript knowledge with Type Guard! A fantasy-themed coding quiz game where you protect the realm from compile errors. Are you a true Type Guard?",

  keywords: [
    "TypeScript",
    "quiz",
    "typescript quiz",
    "ts quiz",
    "programming game",
    "coding quiz",
    "type guard",
    "타입스크립트",
    "타입스크립트 퀴즈",
    "퀴즈",
    "코딩 게임",
    "개발자 게임",
  ],

  authors: [
    {
      name: "Lee jaeyeop",
      url: "https://leejaeyeop-blog.vercel.app/",
    },
  ],
  creator: "Lee jaeyeop",

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: "Type Guard: A TypeScript Quiz Game",
    description:
      "Are you a true Type Guard? Test your skills and protect the realm from compile errors!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Type Guard Game Logo",
      },
    ],
    url: process.env.NEXT_PUBLIC_METADATA_BASE_URL,
    siteName: "Type Guard",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Type Guard: A TypeScript Quiz Game",
    description:
      "Are you a true Type Guard? Test your skills and protect the realm from compile errors!",
    images: ["/og-image.png"],
  },
};

const medievalSharp = MedievalSharp({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${medievalSharp.className} antialiased bg-light dark:bg-black`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
