import { expandedFoldersAtom, folderIdAtom } from "@/lib/atoms"
import { api } from "@lucci/convex/generated/api.js"
import { Doc, Id } from "@lucci/convex/generated/dataModel.js"
import { useMutation } from "@lucci/convex/use-query"
import { Button } from "@lucci/ui/components/button"
import { Input } from "@lucci/ui/components/input"
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@lucci/ui/components/sidebar"
import { useAtomValue, useSetAtom } from "jotai"
import {
  ChevronRight,
  Edit2,
  Folder,
  FolderOpen,
  Lock,
  Check,
  X,
  Edit,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export type FolderWithChildren = Doc<"folders"> & {
  children: FolderWithChildren[]
}

export function FolderItem({
  folder,
  level = 0,
  toggleFolder,
  onBookmarkDropped,
  onFolderDropped,
  isDragging,
  setIsDragging,
}: {
  folder: FolderWithChildren
  level?: number
  isDragging: boolean
  setIsDragging: (ts: boolean) => void
  toggleFolder: (id: Id<"folders">) => void
  onBookmarkDropped?: (
    bookmarkId: Id<"bookmarks">,
    folderId: Id<"folders">,
  ) => void
  onFolderDropped?: (
    folderId: Id<"folders">,
    parentFolderId: Id<"folders">,
  ) => void
}) {
  const hasChildren = folder.children.length > 0
  const expandedFolders = useAtomValue(expandedFoldersAtom)
  const setFolderId = useSetAtom(folderIdAtom)
  const isExpanded = expandedFolders.has(folder._id)

  const mutateFolder = useMutation(api.folders.updateFolder)

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(folder.name)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isInvalidDrop, setIsInvalidDrop] = useState(false)

  const handleChevronClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFolderId(folder._id)
    toggleFolder(folder._id)
  }

  const handleFolderClick = () => {
    if (hasChildren && !isExpanded) {
      setFolderId(folder._id)
      toggleFolder(folder._id)
    }
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(true)
    setEditName(folder.name)
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (editName.trim() && editName !== folder.name) {
      const { _creationTime, _id, children, ...currentFolder } = folder
      await mutateFolder({
        id: folder._id,
        values: {
          ...currentFolder,
          name: editName,
        },
      })
    }
    setIsEditing(false)
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEditName(folder.name)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave(e as any)
    } else if (e.key === "Escape") {
      handleCancel(e as any)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()

    const folderId = e.dataTransfer.getData("application/folder")
    const isFolderDrag = e.dataTransfer.types.includes("application/folder")

    if (isFolderDrag && folderId) {
      // Check if this is a valid drop target
      const isValidTarget =
        folderId !== folder._id && !isDescendant(folder, folderId)
      if (isValidTarget) {
        e.dataTransfer.dropEffect = "move"
        setIsDragOver(true)
        setIsInvalidDrop(false)
      } else {
        e.dataTransfer.dropEffect = "none"
        setIsInvalidDrop(true)
        setIsDragOver(false)
      }
    } else {
      e.dataTransfer.dropEffect = "move"
      setIsDragOver(true)
      setIsInvalidDrop(false)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setIsInvalidDrop(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setIsInvalidDrop(false)

    const bookmarkId = e.dataTransfer.getData("text/plain") as Id<"bookmarks">
    const folderId = e.dataTransfer.getData(
      "application/folder",
    ) as Id<"folders">

    if (bookmarkId && onBookmarkDropped) {
      onBookmarkDropped(bookmarkId, folder._id)
    } else if (folderId && onFolderDropped) {
      // Prevent dropping a folder into itself or its children
      if (folderId === folder._id || isDescendant(folder, folderId)) {
        return
      }
      onFolderDropped(folderId, folder._id)
    }
  }

  // Helper function to check if a folder is a descendant of another folder
  const isDescendant = (
    parentFolder: FolderWithChildren,
    targetId: string,
  ): boolean => {
    for (const child of parentFolder.children) {
      if (child._id === targetId) {
        return true
      }
      if (isDescendant(child, targetId)) {
        return true
      }
    }
    return false
  }

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    e.dataTransfer.setData("application/folder", folder._id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <div
            className={`flex items-center justify-between rounded-md transition-colors ${
              isDragOver
                ? "border-2 border-blue-300 bg-blue-100 dark:border-blue-600 dark:bg-blue-900/20"
                : ""
            } ${isInvalidDrop ? "border-2 border-red-300 bg-red-100 dark:border-red-600 dark:bg-red-900/20" : ""} ${
              isDragging ? "opacity-50" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            {isEditing ? (
              <div className="flex flex-1 items-center gap-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-6 text-sm"
                  autoFocus
                />
                <Button size="icon" variant="ghost" onClick={handleSave}>
                  <Check className="h-3 w-3" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleCancel}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <>
                <Link
                  href={`/folder/${folder._id}`}
                  onClick={handleFolderClick}
                  className="hover:underline"
                >
                  <div className="flex items-center gap-2">
                    {hasChildren &&
                      (isExpanded ? (
                        <FolderOpen className="h-4 w-4" />
                      ) : (
                        <Folder className="h-4 w-4" />
                      ))}
                    {!hasChildren && <Folder className="h-4 w-4" />}
                    <span>{folder.name}</span>
                    {folder.isPrivate && (
                      <Lock className="text-muted-foreground h-4 w-4" />
                    )}
                    <div className="flex items-center gap-2">
                      {hasChildren && (
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                          onClick={handleChevronClick}
                        />
                      )}
                    </div>
                  </div>
                </Link>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => handleEditClick(e)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Edit className="text-muted-foreground h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {isExpanded && hasChildren && (
        <div className="ml-4">
          {folder.children.map((child) => (
            <FolderItem
              key={child._id}
              folder={child}
              level={level + 1}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              toggleFolder={toggleFolder}
              onBookmarkDropped={onBookmarkDropped}
              onFolderDropped={onFolderDropped}
            />
          ))}
        </div>
      )}
    </div>
  )
}
