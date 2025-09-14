"use client"

import {
  bookmarksAtom,
  foldersAtom,
  readingsAtom,
  userClerkIdAtom,
  userIdAtom,
  workspaceIdAtom,
  workspacesAtom,
} from "@/lib/atoms"
import { api } from "@lucci/convex/generated/api.js"
import { useQuery } from "@lucci/convex/use-query"
import { useAtom, useSetAtom } from "jotai"
import { useEffect } from "react"

export function StateSetupWrapper({
  children,
  userId: userClerkId,
}: Readonly<{
  children: React.ReactNode
  userId: string
}>) {
  const [workspaceId, setWorkspaceId] = useAtom(workspaceIdAtom)
  const setUserClerkId = useSetAtom(userClerkIdAtom)
  const setUserId = useSetAtom(userIdAtom)
  const setWorkspaces = useSetAtom(workspacesAtom)
  const setBookmarks = useSetAtom(bookmarksAtom)
  const setFolders = useSetAtom(foldersAtom)
  const setReadings = useSetAtom(readingsAtom)

  const user = useQuery(api.users.currentUser)
  const workspaces = useQuery(api.workspaces.userWorkspaces)
  const folders = useQuery(
    api.folders.workspaceFolders,
    workspaceId ? { id: workspaceId } : "skip",
  )
  const bookmarks = useQuery(
    api.bookmarks.workspaceBookmarks,
    workspaceId ? { id: workspaceId } : "skip",
  )
  const readings = useQuery(
    api.readings.workspaceReadings,
    workspaceId ? { id: workspaceId } : "skip",
  )

  useEffect(() => {
    setUserClerkId(userClerkId)
  }, [userClerkId])

  useEffect(() => {
    if (user) {
      setUserId(user._id)
    }

    if (workspaces) {
      setWorkspaces(workspaces)
      if (workspaces.length > 0) {
        setWorkspaceId(workspaces[0]!._id)
      }
    }

    if (folders) {
      setFolders(folders)
    }

    if (bookmarks) {
      setBookmarks(bookmarks)
    }

    if (readings) {
      setReadings(readings)
    }
  }, [user, workspaces, folders, bookmarks, readings])

  return children
}
