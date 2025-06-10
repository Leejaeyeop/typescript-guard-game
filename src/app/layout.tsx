import type { Metadata } from "next";
import { MedievalSharp } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  // metadataBase: new URL("[https://your-app-url.com]"),

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
    url: "[https://your-app-url.com]",
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
    <html lang="en">
      <body
        className={`${medievalSharp.className} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
