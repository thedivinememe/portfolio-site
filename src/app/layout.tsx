import type { Metadata } from "next";
import { Fraunces, Schibsted_Grotesk, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";

// Display — high-contrast variable serif (opsz axis only, to keep the file
// small). preload:false keeps the ~148KB of fonts off the critical path; text
// paints in the size-matched fallback (CLS stays 0) then swaps in.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  preload: false,
});

// Body / UI — quiet humanist grotesk, deliberately not Inter.
const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Frame numbers / lab captions — the "instrument" voice. On probation.
const splineMono = Spline_Sans_Mono({
  variable: "--font-spline",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Brandon Welner — selected work",
  description:
    "Front-end engineer and creative coder. Selected work in front-end craft and generative / creative-coding — a portfolio that develops out of grain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${schibsted.variable} ${splineMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink-900 text-paper font-body">
        {children}
      </body>
    </html>
  );
}
