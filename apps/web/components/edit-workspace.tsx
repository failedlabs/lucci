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
import { useAtom, useAtomValue } from "jotai"
import {
  selectedWorkspaceAtom,
  showEditWorkspaceAtom,
  userIdAtom,
  workspaceIdAtom,
} from "@/lib/atoms"
import { useMutation } from "@lucci/convex/use-query"
import { api } from "@lucci/convex/generated/api.js"
import { useState } from "react"
import {
  Check,
  Copy,
  LinkIcon,
  Loader2,
  Loader2Icon,
  Trash,
  Users,
} from "lucide-react"
import { Textarea } from "@lucci/ui/components/textarea"
import { Separator } from "@lucci/ui/components/separator"

export function EditWorkspace() {
  const [showEditWorkspace, setShowEditWorkspace] = useAtom(
    showEditWorkspaceAtom,
  )
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const workspace = useAtomValue(selectedWorkspaceAtom)

  const updateWorkspace = useMutation(api.workspaces.updateWorkspace)

  const form = useForm({
    defaultValues: {
      name: workspace?.name,
      notes: workspace?.notes || "",
      icon: workspace?.icon,
      background: workspace?.background,
    },
    onSubmit: async ({ value }) => {
      try {
        setLoading(true)
        const { _id, _creationTime, ...current } = workspace!
        await updateWorkspace({
          id: _id,
          values: {
            ...current,
            name: value.name || workspace!.name,
            notes: value.notes || workspace!.notes,
            icon: value.icon || workspace!.icon,
            background: value.background || workspace!.background,
          },
        })
        console.log("Workspace updated successfully!")
      } catch (error) {
        console.error("Error updating workspace:", error)
      } finally {
        setLoading(false)
      }
    },
  })

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText("workspaceLink")
      setCopied(true)
      console.log("Workspace link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy link")
    }
  }

  return (
    <Drawer
      open={showEditWorkspace}
      onClose={() => setShowEditWorkspace(false)}
    >
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
            <DrawerTitle>{form.getFieldValue("name")}</DrawerTitle>
          </DrawerHeader>

          <div className="space-y-4 p-4 pb-0 pt-1">
            <div className="flex items-center justify-center">
              <Button
                variant={"ghost"}
                type="button"
                className="bg-muted h-12 w-12 text-xl"
              >
                {form.getFieldValue("icon")}
              </Button>
            </div>
            <div className="flex items-end gap-2">
              <Button
                type="button"
                className={form.getFieldValue("background")}
              />
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
            </div>
            <form.Field
              name="notes"
              children={(field) => {
                return (
                  <>
                    <div className="grid w-full max-w-sm items-center gap-3">
                      <Label>Notes</Label>
                      <Textarea
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

            <Separator />
          </div>

          <DrawerFooter>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2Icon className="animate-spin" />}
                Save
              </Button>
              {!workspace?.userDefault && (
                <Button variant={"destructive"} size={"icon"}>
                  <Trash />
                </Button>
              )}
            </div>
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
