import { SidebarInset } from "@lucci/ui/components/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Navbar } from "@/components/navbar"
import { NewBookmark } from "@/components/new-bookmark"
import { FloatingBottomBar } from "@/components/floating-bottom-bar"
import { NewFolder } from "@/components/new-folder"
import { auth } from "@clerk/nextjs/server"
import { Providers } from "@/components/providers"
import { NewWorkspace } from "@/components/new-workspace"
import { EditWorkspace } from "@/components/edit-workspace"
import { Toaster } from "@lucci/ui/components/sonner"
import { AppSection } from "@/components/app-section"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { userId } = await auth()

  if (!userId) {
    return <div>Sign in to view this page</div>
  }

  return (
    <Providers userId={userId!}>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <div className="relative mt-20 flex">
          <div className="flex-1">{children}</div>
          <div className="w-full max-w-md" />

          <section className="absolute right-0 h-[calc(100vh_-_90px)] w-full max-w-md p-3">
            <AppSection />
          </section>
        </div>
      </SidebarInset>

      <FloatingBottomBar />
      <NewBookmark />
      <NewFolder />
      <NewWorkspace />
      <EditWorkspace />

      <Toaster />
    </Providers>
  )
}
