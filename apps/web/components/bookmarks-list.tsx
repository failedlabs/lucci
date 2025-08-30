"use client"

import { Doc } from "@lucci/convex/generated/dataModel.js"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@lucci/ui/components/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lucci/ui/components/popover"
import { Button } from "@lucci/ui/components/button"
import { ExternalLink, Star, Lock, Archive, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { cn } from "@lucci/ui/lib/utils"
import { BookmarkPopover } from "./bookmark-popover"

const cellStyle = "border-none"

const bookmarks: Doc<"bookmarks">[] = [
  {
    _creationTime: Date.now() - 86400000, // 1 day ago
    _id: "bookmark1" as any,
    archived: false,
    domain: "github.com",
    favorite: true,
    isPrivate: false,
    metadata:
      '{"title": "React Documentation", "description": "Official React documentation and tutorials", "image": "https://github.com/favicon.ico"}',
    name: "React Documentation",
    ownerId: "user1" as any,
    tags: ["react", "frontend", "documentation"],
    url: "https://react.dev",
    workspaceId: "workspace1" as any,
    folderId: "folder1-1-1" as any, // React folder
    notes: "Essential React docs for the project",
  },
  {
    _creationTime: Date.now() - 172800000, // 2 days ago
    _id: "bookmark2" as any,
    archived: false,
    domain: "stackoverflow.com",
    favorite: false,
    isPrivate: false,
    metadata:
      '{"title": "How to use React hooks", "description": "Stack Overflow question about React hooks usage", "image": "https://stackoverflow.com/favicon.ico"}',
    name: "React Hooks Best Practices",
    ownerId: "user1" as any,
    tags: ["react", "hooks", "stackoverflow"],
    url: "https://stackoverflow.com/questions/react-hooks-best-practices",
    workspaceId: "workspace1" as any,
    folderId: "folder1-1-1-2" as any, // Hooks folder
    notes: "Great examples of custom hooks",
  },
  {
    _creationTime: Date.now() - 259200000, // 3 days ago
    _id: "bookmark3" as any,
    archived: false,
    domain: "css-tricks.com",
    favorite: true,
    isPrivate: true,
    metadata:
      '{"title": "CSS Grid Layout", "description": "Complete guide to CSS Grid Layout", "image": "https://css-tricks.com/favicon.ico"}',
    name: "CSS Grid Complete Guide",
    ownerId: "user1" as any,
    tags: ["css", "grid", "layout"],
    url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
    workspaceId: "workspace1" as any,
    folderId: "folder2-1" as any, // UI/UX folder
    notes: "Personal reference for grid layouts",
  },
  {
    _creationTime: Date.now() - 345600000, // 4 days ago
    _id: "bookmark4" as any,
    archived: false,
    domain: "dev.to",
    favorite: false,
    isPrivate: false,
    metadata:
      '{"title": "TypeScript Tips", "description": "Advanced TypeScript tips and tricks", "image": "https://dev.to/favicon.ico"}',
    name: "Advanced TypeScript Patterns",
    ownerId: "user1" as any,
    tags: ["typescript", "patterns", "advanced"],
    url: "https://dev.to/typescript-advanced-patterns",
    workspaceId: "workspace1" as any,
    folderId: "folder1-1-1" as any, // React folder
    notes: "Useful for complex type definitions",
  },
  {
    _creationTime: Date.now() - 432000000, // 5 days ago
    _id: "bookmark5" as any,
    archived: true,
    domain: "medium.com",
    favorite: false,
    isPrivate: false,
    metadata:
      '{"title": "Old React Patterns", "description": "Deprecated React patterns", "image": "https://medium.com/favicon.ico"}',
    name: "Legacy React Class Components",
    ownerId: "user1" as any,
    tags: ["react", "legacy", "class-components"],
    url: "https://medium.com/old-react-patterns",
    workspaceId: "workspace1" as any,
    folderId: "folder5" as any, // Old Stuff folder
    notes: "For reference only - deprecated",
  },
  {
    _creationTime: Date.now() - 518400000, // 6 days ago
    _id: "bookmark6" as any,
    archived: false,
    domain: "nextjs.org",
    favorite: true,
    isPrivate: false,
    metadata:
      '{"title": "Next.js App Router", "description": "Next.js 13+ App Router documentation", "image": "https://nextjs.org/favicon.ico"}',
    name: "Next.js App Router Guide",
    ownerId: "user1" as any,
    tags: ["nextjs", "app-router", "react"],
    url: "https://nextjs.org/docs/app",
    workspaceId: "workspace1" as any,
    folderId: "folder1-1" as any, // Frontend folder
    notes: "Essential for the new project",
  },
  {
    _creationTime: Date.now() - 604800000, // 7 days ago
    _id: "bookmark7" as any,
    archived: false,
    domain: "tailwindcss.com",
    favorite: false,
    isPrivate: false,
    metadata:
      '{"title": "Tailwind CSS", "description": "Utility-first CSS framework", "image": "https://tailwindcss.com/favicon.ico"}',
    name: "Tailwind CSS Documentation",
    ownerId: "user1" as any,
    tags: ["css", "tailwind", "utility-first"],
    url: "https://tailwindcss.com/docs",
    workspaceId: "workspace1" as any,
    folderId: "folder1-1-1-1" as any, // Components folder
    notes: "For styling components",
  },
  {
    _creationTime: Date.now() - 691200000, // 8 days ago
    _id: "bookmark8" as any,
    archived: false,
    domain: "figma.com",
    favorite: true,
    isPrivate: true,
    metadata:
      '{"title": "Design System", "description": "Company design system in Figma", "image": "https://figma.com/favicon.ico"}',
    name: "Company Design System",
    ownerId: "user1" as any,
    tags: ["design", "figma", "system"],
    url: "https://figma.com/company-design-system",
    workspaceId: "workspace1" as any,
    folderId: "folder2-1-1" as any, // Design Systems folder
    notes: "Internal design system reference",
  },
]

export function BookmarksList() {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    )

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  const parseMetadata = (metadata: string) => {
    try {
      return JSON.parse(metadata)
    } catch {
      return { title: "", description: "", image: "" }
    }
  }

  return (
    <Table>
      <TableBody>
        {bookmarks.map((bookmark) => {
          const metadata = parseMetadata(bookmark.metadata)
          return (
            <Popover key={bookmark._id}>
              <PopoverTrigger asChild>
                <TableRow className="hover:bg-muted/50 cursor-pointer border-none">
                  <TableCell className={cn(cellStyle, "pl-5")}>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-sm font-medium">
                          {bookmark.name || metadata.title}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {bookmark.favorite && (
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                        )}
                        {bookmark.isPrivate && (
                          <Lock className="text-muted-foreground h-4 w-4" />
                        )}
                        {bookmark.archived && (
                          <Archive className="text-muted-foreground h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={cn(cellStyle)}>
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=16`}
                        alt={bookmark.domain}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{bookmark.domain}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground border-none text-sm">
                    {formatDate(bookmark._creationTime)}
                  </TableCell>
                  <TableCell className={cn(cellStyle, "pr-5 text-right")}>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </PopoverTrigger>

              <PopoverContent
                className="ml-5 w-full max-w-xl p-0"
                align="start"
                side="bottom"
                sideOffset={5}
              >
                <BookmarkPopover
                  bookmark={bookmark}
                  metadata={bookmark.metadata}
                />
              </PopoverContent>
            </Popover>
          )
        })}
      </TableBody>
    </Table>
  )
}
