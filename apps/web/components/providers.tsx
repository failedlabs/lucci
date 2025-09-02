"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider } from "@lucci/ui/components/sidebar"
import { StateSetupWrapper } from "./state-setup-wrapper"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StateSetupWrapper>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <SidebarProvider>{children}</SidebarProvider>
      </NextThemesProvider>
    </StateSetupWrapper>
  )
}
