"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@lucci/ui/components/sidebar"
import { Button } from "@lucci/ui/components/button"
import { Home, PlusCircle, Star } from "lucide-react"
import Link from "next/link"
import { Id } from "@lucci/convex/generated/dataModel.js"
import { FolderItem } from "./folder-item"
import { NavWorkspace } from "./nav-workspace"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { expandedFoldersAtom, folderIdAtom, foldersTreeAtom } from "@/lib/atoms"

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Favorite",
    url: "/favorites",
    icon: Star,
  },
]

export function AppSidebar() {
  const [expandedFolders, setExpandedFolders] = useAtom(expandedFoldersAtom)
  const folderTree = useAtomValue(foldersTreeAtom)

  const toggleFolder = (folderId: Id<"folders">) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroup>
          <div className="flex items-center gap-2">
            <span>🐱</span>
            <h3 className="text-lg font-bold">Lucci</h3>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <Button className="font-bold">
            <PlusCircle />
            New Bookmark
          </Button>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Folders</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {folderTree.map((folder) => (
                <FolderItem
                  level={0}
                  toggleFolder={toggleFolder}
                  key={folder._id}
                  folder={folder}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavWorkspace />
      </SidebarFooter>
    </Sidebar>
  )
}
