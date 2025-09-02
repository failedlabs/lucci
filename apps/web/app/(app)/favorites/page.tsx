"use client"

import { BookmarksList } from "@/components/bookmarks-list"
import { filteredBookmarksAtom } from "@/lib/atoms"
import { useAtomValue } from "jotai"

export default function Favorites() {
  const filteredBookmarks = useAtomValue(filteredBookmarksAtom)

  return (
    <BookmarksList
      bookmarks={filteredBookmarks.filter((bookmark) => bookmark.favorite)}
    />
  )
}
