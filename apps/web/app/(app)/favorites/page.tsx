"use client"

import { BookmarksList } from "@/components/bookmarks-list"
import { Empty } from "@/components/empty"
import { filteredBookmarksAtom } from "@/lib/atoms"
import { useAtomValue } from "jotai"

export default function Favorites() {
  const filteredBookmarks = useAtomValue(filteredBookmarksAtom)
  const bookmarks = filteredBookmarks.filter((bookmark) => bookmark.favorite)

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <Empty
        description={
          "You have no bookmarks in your favorites, try adding a new one"
        }
        title={"No bookmarks here"}
      />
    )
  }

  return <BookmarksList bookmarks={bookmarks} />
}
