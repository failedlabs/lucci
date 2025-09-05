"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider } from "@lucci/ui/components/sidebar"
import { StateSetupWrapper } from "./state-setup-wrapper"

interface Props {
  children: React.ReactNode
  userId: string
}

export function Providers({ children, userId }: Props) {
  return (
    <StateSetupWrapper userId={userId}>
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
