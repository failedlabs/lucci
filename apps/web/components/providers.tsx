"use client"

import * as React from "react"
import { SidebarProvider } from "@lucci/ui/components/sidebar"
import { StateSetupWrapper } from "./state-setup-wrapper"

interface Props {
  children: React.ReactNode
  userId: string
}

export function Providers({ children, userId }: Props) {
  return (
    <StateSetupWrapper userId={userId}>
      <SidebarProvider>{children}</SidebarProvider>
    </StateSetupWrapper>
  )
}
