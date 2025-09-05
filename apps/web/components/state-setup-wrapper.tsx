"use client"

import {
  bookmarksAtom,
  foldersAtom,
  userIdAtom,
  workspaceIdAtom,
  workspacesAtom,
} from "@/lib/atoms"
import { bookmarksMock, foldersMock, workspacesMock } from "@/mocks"
import { useSetAtom } from "jotai"
import { useEffect } from "react"

export function StateSetupWrapper({
  children,
  userId,
}: Readonly<{
  children: React.ReactNode
  userId: string
}>) {
  const setUserId = useSetAtom(userIdAtom)
  const setWorkspaces = useSetAtom(workspacesAtom)
  const setBookmarks = useSetAtom(bookmarksAtom)
  const setFolders = useSetAtom(foldersAtom)
  const setWorkspaceId = useSetAtom(workspaceIdAtom)

  useEffect(() => {
    setUserId(userId)
  }, [userId])

  useEffect(() => {
    setWorkspaces(workspacesMock)
    setBookmarks(bookmarksMock)
    setFolders(foldersMock)

    setWorkspaceId(workspacesMock[0]!._id)
  }, [])

  return children
}
