"use client"

import { searchValueAtom } from "@/lib/atoms"
import { SignedIn, UserButton } from "@clerk/nextjs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@lucci/ui/components/breadcrumb"
import { Input } from "@lucci/ui/components/input"
import { SidebarTrigger } from "@lucci/ui/components/sidebar"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { CommandBar } from "./command-bar"
import { Button } from "@lucci/ui/components/button"
import { Search } from "lucide-react"

export function Navbar() {
  const [searchValue, setSearchValue] = useAtom(searchValueAtom)
  const [openCommand, setOpenCommand] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenCommand((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <nav className="bg-background/50 absolute flex w-full items-center justify-between p-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={() => setOpenCommand(true)}
          variant={"secondary"}
          className="text-muted-foreground"
        >
          <Search />
          <span>Search...</span>
          <div className="min-md:relative ml-5 flex gap-1">
            <kbd className="bg-background text-muted-foreground pointer-events-none flex h-5 select-none items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium [&_svg:not([class*='size-'])]:size-3">
              ⌘
            </kbd>
            <kbd className="bg-background text-muted-foreground pointer-events-none flex h-5 select-none items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium [&_svg:not([class*='size-'])]:size-3">
              J
            </kbd>
          </div>
        </Button>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      <CommandBar open={openCommand} setOpen={setOpenCommand} />
    </nav>
  )
}
