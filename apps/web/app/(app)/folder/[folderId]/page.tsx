"use client"

import { BookmarksList } from "@/components/bookmarks-list"
import { Empty } from "@/components/empty"
import { filteredBookmarksAtom, folderIdAtom } from "@/lib/atoms"
import { Id } from "@lucci/convex/generated/dataModel.js"
import { useAtomValue, useSetAtom } from "jotai"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function FolderContent() {
  const params = useParams<{ folderId: Id<"folders"> }>()

  const setFolderId = useSetAtom(folderIdAtom)
  const filteredBookmarks = useAtomValue(filteredBookmarksAtom)
  const bookmarks = filteredBookmarks.filter(
    (bookmark) => bookmark.folderId === params.folderId,
  )

  useEffect(() => {
    if (params.folderId) {
      setFolderId(params.folderId)
    }
  }, [params.folderId])

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <Empty
        description={
          "You have no bookmarks for this folder, try adding a new one"
        }
        title={"No bookmarks here"}
      />
    )
  }

  return <BookmarksList bookmarks={bookmarks} />
}
