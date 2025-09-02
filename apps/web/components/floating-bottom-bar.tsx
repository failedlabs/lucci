"use client"

import { showNewBookmarkAtom } from "@/lib/atoms"
import { Button } from "@lucci/ui/components/button"
import { useSetAtom } from "jotai"
import { Plus } from "lucide-react"

export function FloatingBottomBar() {
  const setShowNewBookmark = useSetAtom(showNewBookmarkAtom)

  return (
    <div className="fixed bottom-0 z-50 flex w-full items-center justify-end p-5 md:hidden">
      <Button size={"lg"} onClick={() => setShowNewBookmark(true)}>
        <Plus />
      </Button>
    </div>
  )
}
