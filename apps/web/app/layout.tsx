import { Geist, Geist_Mono } from "next/font/google"

import "@lucci/ui/globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import ConvexClientProvider from "@/components/convex-provider"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${fontSans.variable} ${fontMono.variable} min-h-svh font-sans antialiased`}
          >
            {children}
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  )
}
