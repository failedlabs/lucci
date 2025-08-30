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
import { ChevronsUpDown } from "lucide-react"
import { Doc } from "@lucci/convex/generated/dataModel.js"
import { WorkspaceCard } from "./workspace-card"

const workspaces: Doc<"workspaces">[] = [
  {
    _creationTime: Date.now() - 86400000,
    _id: "workspace1" as any,
    icon: "🍕",
    background: "bg-emerald-500",
    members: [],
    name: "Rigo's Workspace",
    ownerId: "" as any,
    userDefault: true,
    notes: "",
  },
  {
    _creationTime: Date.now() - 86400000,
    _id: "workspace2" as any,
    members: ["ssss" as any, "asddde"],
    icon: "💸",
    background: "bg-blue-500",
    name: "Caban Energy",
    ownerId: "" as any,
    userDefault: true,
    notes: "",
  },
  {
    _creationTime: Date.now() - 86400000,
    _id: "workspace3" as any,
    members: [],
    icon: "🚀",
    background: "bg-purple-500",
    name: "UCA",
    ownerId: "" as any,
    userDefault: true,
    notes: "",
  },
]

export function NavWorkspace() {
  const workspace = workspaces[0]
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
              <WorkspaceCard workspace={workspace!} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 px-2 font-normal">
              <WorkspaceCard workspace={workspace!} />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace._id}
                  className="cursor-pointer"
                >
                  <WorkspaceCard workspace={workspace} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
