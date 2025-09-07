import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@lucci/ui/components/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@lucci/ui/components/dropdown-menu"
import { ChevronsUpDown, Plus, Settings } from "lucide-react"
import { WorkspaceCard } from "./workspace-card"
import { useAtomValue, useSetAtom } from "jotai"
import {
  selectedWorkspaceAtom,
  showEditWorkspaceAtom,
  showNewWorkspaceAtom,
  workspaceIdAtom,
  workspacesAtom,
} from "@/lib/atoms"
import { Button } from "@lucci/ui/components/button"

export function NavWorkspace() {
  const setShowNewWorkspace = useSetAtom(showNewWorkspaceAtom)
  const setShowEditWorkspace = useSetAtom(showEditWorkspaceAtom)
  const setWorkspaceId = useSetAtom(workspaceIdAtom)
  const workspaces = useAtomValue(workspacesAtom)
  const workspace = useAtomValue(selectedWorkspaceAtom)
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <WorkspaceCard workspace={workspace} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="flex items-center justify-between p-0 px-2 font-normal">
              <WorkspaceCard workspace={workspace} />
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => {
                  setShowEditWorkspace(true)
                }}
              >
                <Settings />
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace._id}
                  className="cursor-pointer"
                  onClick={() => setWorkspaceId(workspace._id)}
                >
                  <WorkspaceCard workspace={workspace} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <SidebarMenuButton
              size="lg"
              onClick={() => setShowNewWorkspace(true)}
            >
              <Plus />
              New Workspace
            </SidebarMenuButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
