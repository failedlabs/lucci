"use client"

import { showNewBookmarkAtom } from "@/lib/atoms"
import { Button } from "@lucci/ui/components/button"
import { useSetAtom } from "jotai"
import { Plus, PlusCircle } from "lucide-react"

interface Props {
  title: string
  description: string
}

export function Empty({ description, title }: Props) {
  const setShowNewBookmark = useSetAtom(showNewBookmarkAtom)

  return (
    <div className="mt-10 flex h-full flex-1 items-center justify-center">
      <div className="space-y-2 rounded-2xl border-2 border-dashed p-12 text-center">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <Button
          className="mt-3 font-bold"
          size={"lg"}
          onClick={() => setShowNewBookmark(true)}
        >
          <PlusCircle />
          Add new bookmark
        </Button>
      </div>
    </div>
  )
}
