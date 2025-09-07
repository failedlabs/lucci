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
import { useForm } from "@tanstack/react-form"
import { Doc } from "@lucci/convex/generated/dataModel.js"
import { Input } from "@lucci/ui/components/input"
import { Textarea } from "@lucci/ui/components/textarea"
import { useAtom, useAtomValue } from "jotai"
import { showNewFolderAtom, userIdAtom, workspaceIdAtom } from "@/lib/atoms"
import { useMutation } from "@lucci/convex/use-query"
import { api } from "@lucci/convex/generated/api.js"
import { Loader2Icon } from "lucide-react"
import { useState } from "react"
import { toast } from "@lucci/ui/components/sonner"

export function NewFolder() {
  const userId = useAtomValue(userIdAtom)
  const workspaceId = useAtomValue(workspaceIdAtom)
  const [showNewFolder, setShowNewFolder] = useAtom(showNewFolderAtom)
  const [loading, setLoading] = useState(false)

  const createFolder = useMutation(api.folders.createFolder)

  const form = useForm({
    defaultValues: {
      name: "",
      notes: "",
    } satisfies Pick<Doc<"folders">, "name" | "notes">,
    onSubmit: async ({ value }) => {
      try {
        setLoading(true)
        const folder = {
          name: value.name,
          isArchived: false,
          isPrivate: false,
          ownerId: userId!,
          workspaceId: workspaceId!,
          notes: value.notes,
          parentFolderId: undefined,
        } satisfies Omit<Doc<"folders">, "_id" | "_creationTime">

        await createFolder({
          ...folder,
        })
        
        setShowNewFolder(false)
        form.reset()
        toast.success('Folder added', {
          description: `${folder.name} added to your collection`
        })
      } catch (error) {
        toast.error('Error while adding folder', {
          description: JSON.stringify(error)
        })
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <Drawer open={showNewFolder} onClose={() => setShowNewFolder(false)}>
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
            <DrawerTitle>Add a folder</DrawerTitle>
            <DrawerDescription></DrawerDescription>
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
            <form.Field
              name="notes"
              children={(field) => {
                return (
                  <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="picture">Notes</Label>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
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
