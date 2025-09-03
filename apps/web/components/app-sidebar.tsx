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
import { Home, Plus, PlusCircle, Star } from "lucide-react"
import Link from "next/link"
import { Id } from "@lucci/convex/generated/dataModel.js"
import { FolderItem } from "./folder-item"
import { NavWorkspace } from "./nav-workspace"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import {
  expandedFoldersAtom,
  foldersTreeAtom,
  showNewBookmarkAtom,
  showNewFolderAtom,
} from "@/lib/atoms"
import { useState } from "react"

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
  const setShowNewBookmark = useSetAtom(showNewBookmarkAtom)
  const setShowNewFolder = useSetAtom(showNewFolderAtom)
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
          <Button
            className="font-bold"
            onClick={() => setShowNewBookmark(true)}
          >
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
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>Folders</SidebarGroupLabel>
            <Button
              size={"icon"}
              variant={"ghost"}
              className="text-muted-foreground"
              onClick={() => setShowNewFolder(true)}
            >
              <Plus />
            </Button>
          </div>
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
