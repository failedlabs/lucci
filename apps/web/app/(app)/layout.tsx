import { SidebarInset } from "@lucci/ui/components/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Navbar } from "@/components/navbar"
import { NewBookmark } from "@/components/new-bookmark"
import { FloatingBottomBar } from "@/components/floating-bottom-bar"
import { NewFolder } from "@/components/new-folder"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <div className="mt-20">{children}</div>
      </SidebarInset>

      <FloatingBottomBar />
      <NewBookmark />
      <NewFolder />
    </>
  )
}
