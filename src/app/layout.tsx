import type { Metadata } from "next";
import { Inter, Poppins, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.capitalprintandsign.com.au'),
  title: "Capital Print & Sign | Premium Printing & Signage in Canberra",
  description: "Capital Print & Sign — Canberra's trusted printing & signage experts. Business cards, brochures, banners, vehicle wraps, shopfront signage & custom branding. Quality printing with fast turnaround. We Print. You Shine.",
  keywords: ["Printing Services Canberra", "Signage Canberra", "Vehicle Wraps Canberra", "Business Cards Canberra", "Banner Printing Canberra", "Capital Print and Sign", "Shopfront Signage Canberra", "Custom Branding Canberra"],

  openGraph: {
    title: "Capital Print & Sign | We Print. You Shine.",
    description: "Capital Print & Sign — Canberra's trusted printing & signage experts. Business cards, brochures, banners, vehicle wraps, shopfront signage & custom branding solutions for Australian businesses.",
    url: "https://www.capitalprintandsign.com.au",
    siteName: "Capital Print & Sign",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: '/CPS-PrimaryLogo.jpg',
        width: 1200,
        height: 630,
        alt: 'Capital Print & Sign - We Print. You Shine.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Capital Print & Sign | Premium Printing & Signage in Canberra",
    description: "Capital Print & Sign — Canberra's trusted printing & signage experts. Business cards, brochures, banners, vehicle wraps & custom branding. We Print. You Shine.",
    images: ['/CPS-PrimaryLogo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.capitalprintandsign.com.au',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${playfair.variable} ${caveat.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
