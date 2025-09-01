import { FolderWithChildren } from "@/components/folder-item"
import { Doc, Id } from "@lucci/convex/generated/dataModel.js"
import { atom } from "jotai"

export const workspacesAtom = atom<Doc<"workspaces">[]>([])
export const foldersAtom = atom<Doc<"folders">[]>([])
export const bookmarksAtom = atom<Doc<"bookmarks">[]>([])

export const workspaceIdAtom = atom<Id<"workspaces"> | null>(null)
export const folderIdAtom = atom<Id<"folders"> | null>(null)
export const searchValueAtom = atom<string>("")

export const filteredBookmarksAtom = atom<Doc<"bookmarks">[]>((get) => {
  return get(bookmarksAtom).filter(
    (bookmark) => bookmark.workspaceId === get(workspaceIdAtom),
  )
})

export const selectedWorkspaceAtom = atom<Doc<"workspaces"> | null>((get) => {
  if (!get(workspaceIdAtom)) {
    return null
  }

  return get(workspacesAtom).find(
    (workspace) => workspace._id === get(workspaceIdAtom),
  )!
})

export const expandedFoldersAtom = atom<Set<Id<"folders">>>(new Set([]))

export const foldersTreeAtom = atom<FolderWithChildren[]>((get) => {
  const folderMap = new Map<string, FolderWithChildren>()
  const rootFolders: FolderWithChildren[] = []

  get(foldersAtom).forEach((folder) => {
    folderMap.set(folder._id, { ...folder, children: [] })
  })

  get(foldersAtom).forEach((folder) => {
    const folderWithChildren = folderMap.get(folder._id)!

    if (folder.parentFolderId) {
      const parent = folderMap.get(folder.parentFolderId)
      if (parent) {
        parent.children.push(folderWithChildren)
      }
    } else {
      rootFolders.push(folderWithChildren)
    }
  })

  return rootFolders
})
