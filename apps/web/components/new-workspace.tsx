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
import { showNewWorkspaceAtom, userIdAtom } from "@/lib/atoms"
import { useMutation } from "@lucci/convex/use-query"
import { api } from "@lucci/convex/generated/api.js"
import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import { toast } from "@lucci/ui/components/sonner"

export function NewWorkspace() {
  const userId = useAtomValue(userIdAtom)
  const [showNewWorkspace, setShowNewWorkspace] = useAtom(showNewWorkspaceAtom)
  const [loading, setLoading] = useState(false)

  const createWorkspace = useMutation(api.workspaces.createWorkspace)

  const form = useForm({
    defaultValues: {
      name: "",
      icon: "💩",
      background: "bg-rose-500",
    } satisfies Pick<Doc<"workspaces">, "name" | "icon" | "background">,
    onSubmit: async ({ value }) => {
      try {
        setLoading(true)
        const workspace = {
          background: value.background,
          icon: value.icon,
          members: [userId!],
          name: value.name,
          ownerId: userId!,
          userDefault: false,
        } satisfies Omit<Doc<"workspaces">, "_id" | "_creationTime">

        await createWorkspace({
          ...workspace,
        })

        setShowNewWorkspace(false)
        form.reset()
        toast.success('Folder added', {
          description: `${workspace.name} added to your collection`
        })
      } catch (error) {
        toast.error('Error while adding workspace', {
          description: JSON.stringify(error)
        })
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <Drawer open={showNewWorkspace} onClose={() => setShowNewWorkspace(false)}>
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
            <DrawerTitle>Add a Workspace</DrawerTitle>
            <DrawerDescription>
              Share it with your team or friends to add and see the same
              bookmarks or keep it private to use it aside of your main
              workspace
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-4 p-4 pb-0">
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
