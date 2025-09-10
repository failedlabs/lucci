import {
  currentFolderAtom,
  currentFolderParentsAtom,
  folderIdAtom,
} from "@/lib/atoms"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@lucci/ui/components/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@lucci/ui/components/dropdown-menu"
import { useAtomValue, useSetAtom } from "jotai"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppBreadcrumbs() {
  const pathname = usePathname()
  const setFolderId = useSetAtom(folderIdAtom)
  const currentFolder = useAtomValue(currentFolderAtom)
  const folderParents = useAtomValue(currentFolderParentsAtom)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <Link
          href={pathname.includes("favorites") ? "/favorites" : "/"}
          onClick={() => setFolderId(null)}
        >
          <BreadcrumbItem>
            {pathname.includes("favorites") ? "Favorites" : "Home"}
          </BreadcrumbItem>
        </Link>
        {folderParents && folderParents.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="size-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {folderParents.map((fl) => (
                    <Link href={`/folder/${fl._id}`} key={fl._id}>
                      <DropdownMenuItem>{fl.name}</DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}
        <BreadcrumbSeparator />
        {currentFolder && (
          <BreadcrumbItem>
            <BreadcrumbPage>{currentFolder.name}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
