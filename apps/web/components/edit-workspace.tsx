"use client"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@lucci/ui/components/drawer"
import { Button } from "@lucci/ui/components/button"
import { Label } from "@lucci/ui/components/label"
import { useForm } from "@tanstack/react-form"
import { Input } from "@lucci/ui/components/input"
import { useAtom, useAtomValue } from "jotai"
import { selectedWorkspaceAtom, showEditWorkspaceAtom } from "@/lib/atoms"
import { useMutation } from "@lucci/convex/use-query"
import { api } from "@lucci/convex/generated/api.js"
import { useEffect, useState } from "react"
import { Loader2Icon, Trash } from "lucide-react"
import { Textarea } from "@lucci/ui/components/textarea"
import { Separator } from "@lucci/ui/components/separator"
import { toast } from "@lucci/ui/components/sonner"
import { BgColorSelector } from "./bg-color-selector"
import { IconSelector } from "./icon-selector"

export function EditWorkspace() {
  const [showEditWorkspace, setShowEditWorkspace] = useAtom(
    showEditWorkspaceAtom,
  )
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [icon, setIcon] = useState("")
  const [background, setBackground] = useState("")
  const workspace = useAtomValue(selectedWorkspaceAtom)

  const updateWorkspace = useMutation(api.workspaces.updateWorkspace)

  useEffect(() => {
    if (workspace) {
      setIcon(workspace.icon)
      setBackground(workspace.background)
    }
  }, [workspace])

  const form = useForm({
    defaultValues: {
      name: workspace?.name,
      notes: workspace?.notes || "",
    },
    onSubmit: async ({ value }) => {
      try {
        setLoading(true)
        const { _id, _creationTime, ...current } = workspace!

        const newWorkspace = {
          ...current,
          name: value.name || workspace!.name,
          notes: value.notes || workspace!.notes,
          icon: icon || workspace!.icon,
          background: background || workspace!.background,
        }
        await updateWorkspace({
          id: _id,
          values: newWorkspace,
        })
        toast.success("Workspace saved", {
          description: `Changes to ${newWorkspace.name} were saved`,
        })
      } catch (error) {
        toast.error("Error while adding workspace", {
          description: JSON.stringify(error),
        })
      } finally {
        setLoading(false)
      }
    },
  })

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText("workspaceLink")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {}
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
              <IconSelector icon={icon} setIcon={(xd) => setIcon(xd)} />
            </div>
            <div className="flex items-end gap-2">
              <BgColorSelector
                color={background}
                setColor={(color) => {
                  setBackground(color)
                }}
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
