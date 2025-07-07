import AppShell from '@/components/layout/AppShell';
import I18nProvider from "@/components/providers/I18nProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
	title: 'JSF Inventory Management | Jeevan Stambh Foundation',
	description:
	  'Streamline inventory and HR operations with JSF Inventory Management. Built with Next.js, Tailwind CSS, and Firebase for fast, responsive, and real-time tracking of medicines, equipment, and staff.',
	applicationName: 'JSF Inventory Management',
	authors: [{ name: 'Rahul Sharma' }],
	creator: 'Rahul Sharma',
	publisher: 'Jeevan Stambh Foundation',
	formatDetection: {
	  email: false,
	  address: false,
	  telephone: false,
	},
	icons: {
	  icon: [
		{ url: '/favicon.ico' },
		{ url: '/favicon-32x32.png', sizes: '32x32' },
		{ url: '/favicon-16x16.png', sizes: '16x16' },
	  ],
	  shortcut: '/favicon.ico',
	  apple: '/apple-touch-icon.png',
	},
	appleWebApp: {
	  title: 'JSF Inventory Management',
	  statusBarStyle: 'black-translucent',
	  startupImage: [],
	},
	openGraph: {
	  title: 'JSF Inventory Management | Jeevan Stambh Foundation',
	  description:
		'Manage inventory and staff effortlessly using JSF Inventory Management, optimized for NGOs and healthcare foundations.',
	  url: 'https://jsf-inventory-management.vercel.app/',
	  siteName: 'JSF Inventory Management',
	  type: 'website',
	  images: [
		{
		  url: 'https://jsf-inventory-management.vercel.app/og-image.png', // Replace with your actual OG image URL
		  width: 1200,
		  height: 630,
		},
	  ],
	},
	twitter: {
	  card: 'summary_large_image',
	  title: 'JSF Inventory Management | Jeevan Stambh Foundation',
	  description:
		'Built for Jeevan Stambh Foundation to manage inventory and staff efficiently.',
	  creator: '@RahulSharma5430',
	  images: 'https://jsf-inventory-management.vercel.app/og-image.png', // Replace with your actual OG image
	},
	robots: {
	  index: true,
	  follow: true,
	  nocache: false,
	  googleBot: {
		index: true,
		follow: true,
		noimageindex: false,
		'max-video-preview': -1,
		'max-image-preview': 'large',
		'max-snippet': -1,
	  },
	},
	manifest: '/manifest.json',
	keywords:
	  'JSF, Inventory Management, NGO Tools, Healthcare Inventory, Firebase, Next.js, Jeevan Stambh Foundation, Staff Management',
  };
  

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="JSF Inventory" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased !text-gray-700`}
      >
        <AuthProvider>
          <I18nProvider>
            <AppShell>
              {children}
            </AppShell>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
