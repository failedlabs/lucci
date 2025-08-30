import { SidebarInset } from "@lucci/ui/components/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Navbar } from "@/components/navbar"

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
    </>
  )
}
