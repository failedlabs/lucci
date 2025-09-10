import {
  bookmarksAtom,
  foldersAtom,
  showNewBookmarkAtom,
  showNewFolderAtom,
  showNewWorkspaceAtom,
  workspacesAtom,
} from "@/lib/atoms"
import { Avatar, AvatarFallback } from "@lucci/ui/components/avatar"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@lucci/ui/components/command"
import { cn } from "@lucci/ui/lib/utils"
import { useAtomValue, useSetAtom } from "jotai"
import { Folder, House, Plus, Star } from "lucide-react"
import Link from "next/link"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CommandBar({ open, setOpen }: Props) {
  const setShowNewBookmark = useSetAtom(showNewBookmarkAtom)
  const setShowNewFolder = useSetAtom(showNewFolderAtom)
  const setShowNewWorkspace = useSetAtom(showNewWorkspaceAtom)

  const bookmarks = useAtomValue(bookmarksAtom)
  const folders = useAtomValue(foldersAtom)
  const workspaces = useAtomValue(workspacesAtom)

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              setShowNewBookmark(true)
              setOpen(false)
            }}
          >
            <Plus />
            New Bookmark
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setShowNewFolder(true)
              setOpen(false)
            }}
          >
            <Plus />
            New Folder
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setShowNewWorkspace(true)
              setOpen(false)
            }}
          >
            <Plus />
            New Workspace
          </CommandItem>
          <Link href={"/"} onClick={() => setOpen(false)}>
            <CommandItem>
              <House />
              Home
            </CommandItem>
          </Link>
          <Link href={"/favorites"} onClick={() => setOpen(false)}>
            <CommandItem>
              <Star />
              Favorites
            </CommandItem>
          </Link>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Bookmarks">
          {bookmarks.map((bookmark) => (
            <Link href={bookmark.url} target="_blank" key={bookmark._id}>
              <CommandItem>
                <img
                  src={`https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=16`}
                  alt={bookmark.domain}
                  className="h-4 w-4"
                />
                <span>{bookmark.name}</span>
                <span className="text-muted-foreground text-sm">
                  {bookmark.domain}
                </span>
              </CommandItem>
            </Link>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Folders">
          {folders.map((folder) => (
            <Link
              href={`/folder/${folder._id}`}
              key={folder._id}
              onClick={() => setOpen(false)}
            >
              <CommandItem>
                <Folder />
                {folder.name}
              </CommandItem>
            </Link>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Workspaces">
          {workspaces.map((workspace) => (
            <Link
              href={`/folder/${workspace._id}`}
              key={workspace._id}
              onClick={() => setOpen(false)}
            >
              <CommandItem>
                <Avatar className="h-6 w-6 rounded-lg">
                  <AvatarFallback
                    className={cn("rounded-lg", workspace?.background)}
                  >
                    {workspace?.icon}
                  </AvatarFallback>
                </Avatar>
                <span>{workspace.name}</span>
              </CommandItem>
            </Link>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
