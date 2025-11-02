import localFont from "next/font/local";

export const geistSans = localFont({
  variable: "--font-geist-sans",
  display: "swap",
  src: [
    {
      path: "../../node_modules/@fontsource/geist/files/geist-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/geist/files/geist-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/geist/files/geist-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/geist/files/geist-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const geistMono = localFont({
  variable: "--font-geist-mono",
  display: "swap",
  src: [
    {
      path: "../../node_modules/@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/geist-mono/files/geist-mono-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});
