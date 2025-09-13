"use client"

import { Doc } from "@lucci/convex/generated/dataModel.js"
import { Clock } from "lucide-react"
import Link from "next/link"
import { BookmarkPopover } from "./bookmark-popover"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@lucci/ui/components/hover-card"
import { useMutation } from "@lucci/convex/use-query"
import { api } from "@lucci/convex/generated/api.js"
import { useState } from "react"
import { Card } from "@lucci/ui/components/card"
import { MetaResult } from "@/app/fetch-metadata"

interface Props {
  bookmarks: Doc<"bookmarks">[]
}

interface BookmarkCardProps {
  bookmark: Doc<"bookmarks">
  metadata?: MetaResult
}

function BookmarkCard({ bookmark, metadata }: BookmarkCardProps) {
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

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={bookmark.url} target="_blank" referrerPolicy="no-referrer">
          <Card className="hover:bg-muted/50 border-border bg-card mb-3 cursor-pointer rounded-xl p-3 transition-all duration-200 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div className="mr-3">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=16`}
                  alt={bookmark.domain}
                  className="h-4 w-4"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-card-foreground truncate text-pretty text-sm font-medium leading-tight">
                  {bookmark.name || metadata?.title}
                </h3>
                <p className="text-muted-foreground text-xs">
                  {bookmark.domain}
                </p>
              </div>

              {/* Right side - Category and Read Time */}
              <div className="ml-4 flex flex-shrink-0 items-center gap-3">
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {formatDate(bookmark._creationTime)}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-sm p-4" align="center" side="bottom">
        <BookmarkPopover bookmark={bookmark} />
      </HoverCardContent>
    </HoverCard>
  )
}

export function BookmarksList({ bookmarks }: Props) {
  const deleteBookmark = useMutation(api.bookmarks.deleteBookmark)
  const [draggedBookmarkId, setDraggedBookmarkId] = useState<string | null>(
    null,
  )

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

  const handleDragStart = (e: React.DragEvent, bookmarkId: string) => {
    setDraggedBookmarkId(bookmarkId)
    e.dataTransfer.setData("text/plain", bookmarkId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedBookmarkId(null)
  }

  return (
    <div className={`w-full p-4`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-foreground mb-2 text-balance text-2xl font-semibold"></h2>
        <p className="text-muted-foreground">
          {bookmarks.length} {bookmarks.length === 1 ? "bookmark" : "bookmarks"}{" "}
          saved
        </p>
      </div>

      {/* Bookmarks List */}
      <div className="space-y-2">
        {bookmarks.map((bookmark) => {
          const metadata = parseMetadata(bookmark.metadata)
          return (
            <BookmarkCard
              key={bookmark._id}
              bookmark={bookmark}
              metadata={metadata}
            />
          )
        })}
      </div>
    </div>
  )
}
