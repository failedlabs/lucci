"use client"

import { BookmarksList } from "@/components/bookmarks-list"
import { filteredBookmarksAtom, folderIdAtom } from "@/lib/atoms"
import { Id } from "@lucci/convex/generated/dataModel.js"
import { useAtomValue, useSetAtom } from "jotai"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function FolderContent() {
  const params = useParams<{ folderId: Id<"folders"> }>()

  const setFolderId = useSetAtom(folderIdAtom)
  const filteredBookmarks = useAtomValue(filteredBookmarksAtom)

  useEffect(() => {
    if (params.folderId) {
      setFolderId(params.folderId)
    }
  }, [params.folderId])

  return (
    <BookmarksList
      bookmarks={filteredBookmarks.filter(
        (bookmark) => bookmark.folderId === params.folderId,
      )}
    />
  )
}
