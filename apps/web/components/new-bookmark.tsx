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
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import {
  bookmarksAtom,
  folderIdAtom,
  showNewBookmarkAtom,
  workspaceIdAtom,
} from "@/lib/atoms"

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
  const workspaceId = useAtomValue(workspaceIdAtom)
  const folderId = useAtomValue(folderIdAtom)
  const setBookmarks = useSetAtom(bookmarksAtom)
  const [showNewBookmark, setShowNewBookmark] = useAtom(showNewBookmarkAtom)

  const form = useForm({
    defaultValues: {
      name: "",
      url: "",
    } satisfies Pick<Doc<"bookmarks">, "name" | "url">,
    onSubmit: async ({ value }) => {
      const url = new URL(value.url)
      const bookmark = {
        name: value.name,
        url: value.url,
        domain: url.hostname,
        favorite: false,
        archived: false,
        folderId: folderId || undefined,
        isPrivate: false,
        metadata: "{}",
        notes: undefined,
        ownerId: "" as any,
        _id: "" as any,
        _creationTime: 29828121,
        tags: [],
        workspaceId: workspaceId!,
      } satisfies Doc<"bookmarks">

      setBookmarks((bookmarks) => [...bookmarks, bookmark])
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
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return "An URL is required"
                  }
                  if (!assertIsUrl(value)) {
                    return "Value needs to be a valid URL"
                  }

                  return undefined
                },
              }}
              children={(field) => {
                return (
                  <>
                    <div className="grid w-full max-w-sm items-center gap-3">
                      <Label htmlFor="picture">Name</Label>
                      <Input
                        required
                        id={field.name}
                        placeholder="Save as you wish... (not required)"
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
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return "An URL is required"
                  }
                  if (!assertIsUrl(value)) {
                    return "Value needs to be a valid URL"
                  }

                  return undefined
                },
              }}
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
            <Button type="submit">Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
