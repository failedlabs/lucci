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
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { foldersAtom, showNewFolderAtom, workspaceIdAtom } from "@/lib/atoms"

export function NewFolder() {
  const workspaceId = useAtomValue(workspaceIdAtom)
  const setFolders = useSetAtom(foldersAtom)
  const [showNewFolder, setShowNewFolder] = useAtom(showNewFolderAtom)

  const form = useForm({
    defaultValues: {
      name: "",
      notes: "",
    } satisfies Pick<Doc<"folders">, "name" | "notes">,
    onSubmit: async ({ value }) => {
      const folder = {
        name: value.name,
        _id: "" as any,
        _creationTime: 0,
        isArchived: false,
        isPrivate: false,
        ownerId: "" as any,
        workspaceId: workspaceId!,
        notes: value.notes,
        parentFolderId: undefined,
      } satisfies Doc<"folders">

      setFolders((folders) => [...folders, folder])
      setShowNewFolder(false)
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
