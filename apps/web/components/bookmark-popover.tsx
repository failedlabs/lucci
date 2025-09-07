import { fetchMetadata } from "@/app/fetch-metadata"
import { api } from "@lucci/convex/generated/api.js"
import { Doc } from "@lucci/convex/generated/dataModel.js"
import { useMutation } from "@lucci/convex/use-query"
import { Button } from "@lucci/ui/components/button"
import { Input } from "@lucci/ui/components/input"
import { Label } from "@lucci/ui/components/label"
import { Separator } from "@lucci/ui/components/separator"
import { toast } from "@lucci/ui/components/sonner"
import { Textarea } from "@lucci/ui/components/textarea"
import { cn } from "@lucci/ui/lib/utils"
import { useForm } from "@tanstack/react-form"
import {
  Archive,
  Copy,
  Edit,
  ExternalLink,
  Loader2Icon,
  Lock,
  Save,
  Star,
  Tag,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Props {
  bookmark: Doc<"bookmarks">
  metadata?: any
}

export function BookmarkPopover({ bookmark, metadata }: Props) {
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const mutateBookmark = useMutation(api.bookmarks.updateBookmark)

  const form = useForm({
    defaultValues: {
      name: bookmark.name,
      url: bookmark.url,
      notes: bookmark.notes,
    } satisfies Pick<Doc<"bookmarks">, "name" | "url" | "notes">,
    onSubmit: async ({ value }) => {
      try {
        setLoading(true)
        const url = new URL(value.url)
        const { data: metadata, error } = await fetchMetadata(value.url)

        if (error || !metadata) {
          throw Error("Error getting metadata of url")
        }

        const { _id, _creationTime, ...current } = bookmark
        const newBookmark = {
          ...current,
          name: value.name === "" ? bookmark.name : value.name,
          notes: value.notes === "" ? bookmark.notes : value.notes,
          url: value.url === "" ? bookmark.url : value.url,
          domain: value.url === "" ? bookmark.domain : url.hostname,
          metadata:
            value.url === "" ? bookmark.metadata : JSON.stringify(metadata),
        }
        await mutateBookmark({
          values: newBookmark,
          id: _id,
        })
        form.reset()
        toast.success("Bookmark saved", {
          description: `Changes to ${newBookmark.name} were saved`,
        })
      } catch (error) {
        toast.error("Error while saving bookmark", {
          description: JSON.stringify(error),
        })
      } finally {
        setEdit(false)
        setLoading(false)
      }
    },
  })

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

  async function favorite() {
    const { _id, _creationTime, ...newBookmark } = bookmark
    await mutateBookmark({
      id: bookmark._id,
      values: {
        ...newBookmark,
        favorite: !newBookmark.favorite,
      },
    })
  }

  return (
    <div className="min-w-sm space-y-3 p-6">
      {/* Header */}
      {edit ? (
        <div className="space-y-4">
          <form.Field
            name="name"
            children={(field) => {
              return (
                <>
                  <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="picture">Name</Label>
                    <Input
                      id={field.name}
                      placeholder="Save it as you wish... (not required)"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                </>
              )
            }}
          />
          <form.Field
            name="url"
            children={(field) => {
              return (
                <>
                  <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="picture">URL</Label>
                    <Input
                      required
                      id={field.name}
                      placeholder=""
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                </>
              )
            }}
          />
          <form.Field
            name="notes"
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="picture">Notes</Label>
                    <Textarea
                      required
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                </>
              )
            }}
          />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <img
                src={`https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=32`}
                alt={bookmark.domain}
                className="h-8 w-8 rounded"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  {bookmark.name || metadata.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {bookmark.domain}
                </p>
                <div className="flex items-center gap-2">
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
                <Copy className="h-4 w-4" />
                Copy URL
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit
                </Link>
              </Button>
            </div>
          </div>

          {/* Notes */}
          {bookmark.notes && (
            <div className="">
              <p className="bg-muted/50 rounded-md p-3 text-sm">
                {bookmark.notes}
              </p>
            </div>
          )}

          {/* Tags */}
          {bookmark.tags.length > 0 && (
            <div className="space-y-2">
              <Separator />
              <div className="flex items-center gap-2">
                <Tag className="text-muted-foreground h-4 w-4" />
                <h4 className="text-muted-foreground text-sm font-medium">
                  Tags
                </h4>
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

          {/* Metadata */}
          {/* <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <h4 className="text-muted-foreground text-sm font-medium">Created</h4>
        </div>
        <p className="text-sm">{formatDate(bookmark._creationTime)}</p>
      </div> */}
        </>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t pt-4">
        {edit ? (
          <Button
            size={"sm"}
            disabled={loading}
            onClick={() => form.handleSubmit()}
          >
            {loading && <Loader2Icon className="animate-spin" />}
            Save
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={favorite}>
              <Star
                className={cn(
                  "h-4 w-4",
                  bookmark.favorite ? "fill-current text-yellow-500" : "",
                )}
              />
              {bookmark.favorite ? "Remove" : "Favorite"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEdit(true)}>
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}

        {edit ? (
          <Button variant={"outline"} onClick={() => setEdit(false)}>
            Cancel
          </Button>
        ) : (
          <span className="text-sm">{formatDate(bookmark._creationTime)}</span>
        )}
      </div>
    </div>
  )
}
