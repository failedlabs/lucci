import { Doc } from "@lucci/convex/generated/dataModel.js"
import { Button } from "@lucci/ui/components/button"
import {
  Archive,
  Calendar,
  Copy,
  Edit,
  ExternalLink,
  FileText,
  Lock,
  Star,
  Tag,
  Trash2,
} from "lucide-react"
import Link from "next/link"

interface Props {
  bookmark: Doc<"bookmarks">
  metadata?: any
}

export function BookmarkPopover({ bookmark, metadata }: Props) {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <img
            src={`https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=32`}
            alt={bookmark.domain}
            className="h-8 w-8 rounded"
          />
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">
              {bookmark.name || metadata.title}
            </h3>
            <p className="text-muted-foreground text-sm">{bookmark.domain}</p>
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
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(bookmark.url)}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy URL
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={bookmark.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit
            </Link>
          </Button>
        </div>
      </div>

      {/* Description */}
      {metadata.description && (
        <div className="space-y-2">
          <h4 className="text-muted-foreground text-sm font-medium">
            Description
          </h4>
          <p className="text-sm">{metadata.description}</p>
        </div>
      )}

      {/* Tags */}
      {bookmark.tags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag className="text-muted-foreground h-4 w-4" />
            <h4 className="text-muted-foreground text-sm font-medium">Tags</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {bookmark.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-muted rounded-md px-2 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {bookmark.notes && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="text-muted-foreground h-4 w-4" />
            <h4 className="text-muted-foreground text-sm font-medium">Notes</h4>
          </div>
          <p className="bg-muted/50 rounded-md p-3 text-sm">{bookmark.notes}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <h4 className="text-muted-foreground text-sm font-medium">Created</h4>
        </div>
        <p className="text-sm">{formatDate(bookmark._creationTime)}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t pt-4">
        <Button variant="ghost" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="ghost" size="sm">
          <Star className="mr-2 h-4 w-4" />
          {bookmark.favorite ? "Remove from favorites" : "Add to favorites"}
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  )
}
