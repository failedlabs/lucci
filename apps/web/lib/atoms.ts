import { FolderWithChildren } from "@/components/folder-item"
import { Doc, Id } from "@lucci/convex/generated/dataModel.js"
import { atom } from "jotai"

export const userIdAtom = atom<Id<"users"> | null>(null)
export const userClerkIdAtom = atom<string | null>("")
export const showNewBookmarkAtom = atom<boolean>(false)
export const showNewFolderAtom = atom<boolean>(false)
export const showNewWorkspaceAtom = atom<boolean>(false)
export const showEditWorkspaceAtom = atom<boolean>(false)

export const workspacesAtom = atom<Doc<"workspaces">[]>([])
export const foldersAtom = atom<Doc<"folders">[]>([])
export const bookmarksAtom = atom<Doc<"bookmarks">[]>([])

export const workspaceIdAtom = atom<Id<"workspaces"> | null>(null)
export const folderIdAtom = atom<Id<"folders"> | null>(null)

export const filteredBookmarksAtom = atom<Doc<"bookmarks">[]>((get) => {
  return get(bookmarksAtom).filter(
    (bookmark) => bookmark.workspaceId === get(workspaceIdAtom),
  )
})

export const currentFolderAtom = atom<Doc<"folders"> | null>((get) => {
  if (!get(folderIdAtom)) {
    return null
  }

  return get(foldersAtom).find((fl) => fl._id === get(folderIdAtom))!
})

export const currentFolderParentsAtom = atom<Doc<"folders">[] | null>((get) => {
  if (!get(currentFolderAtom)) {
    return null
  }
  const folders = get(foldersAtom)
  const current = get(currentFolderAtom)!

  const idToFolder = new Map<string, Doc<"folders">>()
  for (const folder of folders) {
    idToFolder.set(folder._id, folder)
  }

  const chain: Doc<"folders">[] = []
  let cursor: Doc<"folders"> | undefined = current

  while (cursor) {
    chain.push(cursor)
    if (!cursor.parentFolderId) break
    cursor = idToFolder.get(cursor.parentFolderId)
  }

  return chain.filter((fl) => fl._id !== current._id)
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
