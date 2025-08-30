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
import {
  Home,
  PlusCircle,
  Star,
  Folder,
  FolderOpen,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { Doc } from "@lucci/convex/generated/dataModel.js"
import { useState } from "react"
import { FolderItem, FolderWithChildren } from "./folder-item"
import { NavWorkspace } from "./nav-workspace"

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

const folders: Doc<"folders">[] = [
  {
    isArchived: false,
    isPrivate: false,
    name: "Work",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: undefined,
    _id: "folder1" as any,
    _creationTime: Date.now() - 100000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "Frontend",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder1" as any,
    _id: "folder1-1" as any,
    _creationTime: Date.now() - 95000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "Backend",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder1" as any,
    _id: "folder1-2" as any,
    _creationTime: Date.now() - 90000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "Tools",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder1" as any,
    _id: "folder1-3" as any,
    _creationTime: Date.now() - 85000,
  },
  {
    isArchived: false,
    isPrivate: true,
    name: "Personal",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: undefined,
    _id: "folder2" as any,
    _creationTime: Date.now() - 90000,
  },
  {
    isArchived: false,
    isPrivate: true,
    name: "UI/UX",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder2" as any,
    _id: "folder2-1" as any,
    _creationTime: Date.now() - 85000,
  },
  {
    isArchived: false,
    isPrivate: true,
    name: "Resources",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder2" as any,
    _id: "folder2-2" as any,
    _creationTime: Date.now() - 80000,
  },
  {
    isArchived: false,
    isPrivate: true,
    name: "Inspiration",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder2" as any,
    _id: "folder2-3" as any,
    _creationTime: Date.now() - 75000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "Projects",
    ownerId: "user2" as any,
    workspaceId: "workspace2" as any,
    parentFolderId: undefined,
    _id: "folder3" as any,
    _creationTime: Date.now() - 80000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "Articles",
    ownerId: "user2" as any,
    workspaceId: "workspace2" as any,
    parentFolderId: "folder3" as any,
    _id: "folder3-1" as any,
    _creationTime: Date.now() - 75000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "Documentation",
    ownerId: "user2" as any,
    workspaceId: "workspace2" as any,
    parentFolderId: "folder3" as any,
    _id: "folder3-2" as any,
    _creationTime: Date.now() - 70000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "2024",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder1" as any,
    _id: "folder4" as any,
    _creationTime: Date.now() - 70000,
  },
  {
    isArchived: true,
    isPrivate: false,
    name: "Old Stuff",
    ownerId: "user2" as any,
    workspaceId: "workspace2" as any,
    parentFolderId: "folder3" as any,
    _id: "folder5" as any,
    _creationTime: Date.now() - 60000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "React",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder1-1" as any,
    _id: "folder1-1-1" as any,
    _creationTime: Date.now() - 94000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "Components",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder1-1-1" as any,
    _id: "folder1-1-1-1" as any,
    _creationTime: Date.now() - 93000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "Hooks",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder1-1-1" as any,
    _id: "folder1-1-1-2" as any,
    _creationTime: Date.now() - 92000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "Vue",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder1-1" as any,
    _id: "folder1-1-2" as any,
    _creationTime: Date.now() - 91000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "API",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder1-2" as any,
    _id: "folder1-2-1" as any,
    _creationTime: Date.now() - 89000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "Endpoints",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder1-2-1" as any,
    _id: "folder1-2-1-1" as any,
    _creationTime: Date.now() - 88000,
  },
  {
    isArchived: false,
    isPrivate: false,
    name: "Database",
    ownerId: "user1" as any,
    workspaceId: "workspace1" as any,
    parentFolderId: "folder1-2" as any,
    _id: "folder1-2-2" as any,
    _creationTime: Date.now() - 87000,
  },
]

export function AppSidebar() {
  // TODO: migrate to jotai atom
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  // TODO: Migrate to jotai atom
  const buildFolderTree = (folders: Doc<"folders">[]): FolderWithChildren[] => {
    const folderMap = new Map<string, FolderWithChildren>()
    const rootFolders: FolderWithChildren[] = []

    folders.forEach((folder) => {
      folderMap.set(folder._id, { ...folder, children: [] })
    })

    folders.forEach((folder) => {
      const folderWithChildren = folderMap.get(folder._id)!

      if (folder.parentFolderId) {
        const parent = folderMap.get(folder.parentFolderId)
        if (parent) {
          parent.children.push(folderWithChildren)
        }
      } else {
        rootFolders.push(folderWithChildren)
      }
    })

    return rootFolders
  }

  const folderTree = buildFolderTree(folders)

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
                  expandedFolders={expandedFolders}
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
