import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteDescription =
  "Embedded Software Engineer specializing in Linux kernel drivers, ARM SoC platforms, TF-A, TrustZone, SMC, OpenWrt, and low-level hardware bring-up.";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://mayur-kumar-portfolio.vercel.app"
  ),
  title: {
    default: "Mayur Kumar | Embedded Software Engineer",
    template: "%s | Mayur Kumar"
  },
  description: siteDescription,
  applicationName: "Mayur Kumar Portfolio",
  authors: [{ name: "Mayur Kumar", url: "https://github.com/Strong10mede" }],
  creator: "Mayur Kumar",
  keywords: [
    "Mayur Kumar",
    "Embedded Software Engineer",
    "Linux Kernel",
    "ARM SoC",
    "ARM TrustZone",
    "TF-A",
    "SMC",
    "OpenWrt",
    "Device Tree",
    "U-Boot"
  ],
  openGraph: {
    title: "Mayur Kumar | Embedded Software Engineer",
    description: siteDescription,
    url: "/",
    siteName: "Mayur Kumar Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mayur Kumar terminal portfolio preview"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mayur Kumar | Embedded Software Engineer",
    description: siteDescription,
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
