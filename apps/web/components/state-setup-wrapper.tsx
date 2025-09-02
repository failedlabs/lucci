"use client"

import {
  bookmarksAtom,
  foldersAtom,
  workspaceIdAtom,
  workspacesAtom,
} from "@/lib/atoms"
import { bookmarksMock, foldersMock, workspacesMock } from "@/mocks"
import { useSetAtom } from "jotai"
import { useEffect } from "react"

export function StateSetupWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const setWorkspaces = useSetAtom(workspacesAtom)
  const setBookmarks = useSetAtom(bookmarksAtom)
  const setFolders = useSetAtom(foldersAtom)
  const setWorkspaceId = useSetAtom(workspaceIdAtom)

  useEffect(() => {
    setWorkspaces(workspacesMock)
    setBookmarks(bookmarksMock)
    setFolders(foldersMock)

    setWorkspaceId(workspacesMock[0]!._id)
  }, [])

  return children
}
