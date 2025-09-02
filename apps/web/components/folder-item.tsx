import { expandedFoldersAtom, folderIdAtom } from "@/lib/atoms"
import { Doc, Id } from "@lucci/convex/generated/dataModel.js"
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@lucci/ui/components/sidebar"
import { useAtomValue, useSetAtom } from "jotai"
import { ChevronRight, Folder, FolderOpen, Lock } from "lucide-react"
import Link from "next/link"

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

  return (
    <div>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href={`/folder/${folder._id}`} onClick={handleFolderClick}>
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
