"use client"

import { searchValueAtom } from "@/lib/atoms"
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

export function Navbar() {
  const [searchValue, setSearchValue] = useAtom(searchValueAtom)

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

      <div>
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
    </nav>
  )
}
