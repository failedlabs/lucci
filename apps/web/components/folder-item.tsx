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
}: {
  folder: FolderWithChildren
  level?: number
  toggleFolder: (id: Id<"folders">) => void
}) {
  const hasChildren = folder.children.length > 0
  const expandedFolders = useAtomValue(expandedFoldersAtom)
  const setFolderId = useSetAtom(folderIdAtom)
  const isExpanded = expandedFolders.has(folder._id)

  const mutateFolder = useMutation(api.folders.updateFolder)

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(folder.name)

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

  return (
    <div>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <div className="flex items-center justify-between">
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
                  </div>
                  <div className="flex items-center gap-2">
                    {hasChildren && (
                      <ChevronRight
                        className={`h-3 w-3 transition-transform ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                        onClick={handleChevronClick}
                      />
                    )}
                  </div>
                </Link>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => handleEditClick(e)}
                >
                  <Edit className="h-3 w-3" />
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
              toggleFolder={toggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  )
}
