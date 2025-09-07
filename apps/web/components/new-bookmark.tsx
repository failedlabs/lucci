"use client"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@lucci/ui/components/drawer"
import { Button } from "@lucci/ui/components/button"
import { Label } from "@lucci/ui/components/label"
import { AnyFieldApi, useForm } from "@tanstack/react-form"
import { Doc } from "@lucci/convex/generated/dataModel.js"
import { Input } from "@lucci/ui/components/input"
import { Textarea } from "@lucci/ui/components/textarea"
import { useAtom, useAtomValue } from "jotai"
import {
  folderIdAtom,
  showNewBookmarkAtom,
  userIdAtom,
  workspaceIdAtom,
} from "@/lib/atoms"
import { useMutation } from "@lucci/convex/use-query"
import { api } from "@lucci/convex/generated/api.js"
import { fetchMetadata } from "@/app/fetch-metadata"
import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import { toast } from "@lucci/ui/components/sonner"

function UrlFieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-sm text-rose-400">
          {field.state.meta.errors.join(", ")}
        </em>
      ) : null}
    </>
  )
}

export function NewBookmark() {
  const userId = useAtomValue(userIdAtom)
  const workspaceId = useAtomValue(workspaceIdAtom)
  const folderId = useAtomValue(folderIdAtom)
  const [showNewBookmark, setShowNewBookmark] = useAtom(showNewBookmarkAtom)

  const createBookmark = useMutation(api.bookmarks.createBookmark)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      name: "",
      url: "",
    } satisfies Pick<Doc<"bookmarks">, "name" | "url">,
    onSubmit: async ({ value }) => {
      try {
        setLoading(true)
        const url = new URL(value.url)
        const { data: metadata, error } = await fetchMetadata(value.url)

        if (error || !metadata) {
          throw Error("Error getting metadata of url")
        }

        const bookmark = {
          name: value.name === "" ? metadata.title || url.hostname : value.name,
          url: value.url,
          domain: url.hostname,
          favorite: false,
          archived: false,
          folderId: folderId || undefined,
          isPrivate: false,
          metadata: JSON.stringify(metadata),
          notes: metadata.description || undefined,
          ownerId: userId!,
          tags: [],
          workspaceId: workspaceId!,
        } satisfies Omit<Doc<"bookmarks">, "_id" | "_creationTime">

        await createBookmark({
          ...bookmark,
        })
        form.reset()
        setShowNewBookmark(false)

        toast.success('Bookmark added', {
          description: `${bookmark.name} added to your collection`
        })
      } catch (error) {
        toast.error('Error while adding bookmark', {
          description: JSON.stringify(error)
        })
      } finally {
        setLoading(false)
      }
    },
  })

  function assertIsUrl(value: string): boolean {
    const defaultScheme = "https://"
    if (typeof value !== "string" || value.trim() === "") {
      return false
    }
    const candidate = value.includes("://") ? value : `${defaultScheme}${value}`
    let url: URL
    try {
      url = new URL(candidate)
    } catch {
      return false
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false
    }

    if (!url.hostname) {
      return false
    }

    return true
  }

  return (
    <Drawer open={showNewBookmark} onClose={() => setShowNewBookmark(false)}>
      <DrawerContent>
        <form
          className="mx-auto w-full max-w-sm"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <DrawerHeader>
            <DrawerTitle>Add a new bookmark</DrawerTitle>
            <DrawerDescription>
              When you add a new bookmark, Lucci will sync it into all your
              devices.
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-4 p-4 pb-0">
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
                    <UrlFieldInfo field={field} />
                  </>
                )
              }}
            />
            <form.Field
              name="url"
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <div className="grid w-full max-w-sm items-center gap-3">
                      <Label htmlFor="picture">URL*</Label>
                      <Textarea
                        required
                        id={field.name}
                        placeholder="https://www.somedomain.com"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                    <UrlFieldInfo field={field} />
                  </>
                )
              }}
            />
          </div>

          <DrawerFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2Icon className="animate-spin" />}
              Submit
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
