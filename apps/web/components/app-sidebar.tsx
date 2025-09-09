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
import { useMutation } from "@lucci/convex/use-query"
import { api } from "@lucci/convex/generated/api.js"
import { toast } from "@lucci/ui/components/sonner"

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
  const [isFolderDragging, setIsFolderDragging] = useState(false)
  const folderTree = useAtomValue(foldersTreeAtom)
  const moveBookmarkToFolder = useMutation(api.bookmarks.moveBookmarkToFolder)
  const moveFolderToParent = useMutation(api.folders.moveFolderToParent)

  const toggleFolder = (folderId: Id<"folders">) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleBookmarkDropped = async (
    bookmarkId: string,
    folderId: string,
  ) => {
    try {
      await moveBookmarkToFolder({
        id: bookmarkId as any,
        folderId: folderId as any,
      })
      toast.success("Bookmark moved to folder successfully!")
    } catch (error) {
      toast.error("Failed to move bookmark to folder", {
        description: JSON.stringify(error),
      })
    }
  }

  const handleFolderDropped = async (
    folderId: Id<"folders">,
    parentFolderId: Id<"folders">,
  ) => {
    try {
      await moveFolderToParent({
        id: folderId,
        parentFolderId: parentFolderId !== "" ? parentFolderId : undefined,
      })
      toast.success("Folder moved")
    } catch (error) {
      toast.error("Failed to move folder", {
        description: JSON.stringify(error),
      })
    }
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
                  isDragging={isFolderDragging}
                  setIsDragging={setIsFolderDragging}
                  key={folder._id}
                  folder={folder}
                  onBookmarkDropped={handleBookmarkDropped}
                  onFolderDropped={handleFolderDropped}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Root drop zone for moving folders to root level */}
        <SidebarGroup>
          <SidebarGroupContent>
            {isFolderDragging && (
              <div
                className="text-muted-foreground border-muted-foreground/20 rounded-md border-2 border-dashed p-2 text-center text-sm transition-colors"
                onDragOver={(e) => {
                  e.preventDefault()
                  e.dataTransfer.dropEffect = "move"
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  const folderId = e.dataTransfer.getData(
                    "application/folder",
                  ) as Id<"folders">
                  if (folderId) {
                    handleFolderDropped(folderId, "" as any)
                  }
                }}
              >
                Drop folders here to move to root level
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavWorkspace />
      </SidebarFooter>
    </Sidebar>
  )
}
