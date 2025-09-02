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

interface Props {
  bookmarks: Doc<"bookmarks">[]
}

export function BookmarksList({ bookmarks }: Props) {
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
