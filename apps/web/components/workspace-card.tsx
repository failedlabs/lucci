import { Doc } from "@lucci/convex/generated/dataModel.js"
import { Avatar, AvatarFallback } from "@lucci/ui/components/avatar"
import { cn } from "@lucci/ui/lib/utils"

interface Props {
  workspace: Doc<"workspaces">
}

export function WorkspaceCard({ workspace }: Props) {
  return (
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarFallback className={cn("rounded-lg", workspace.background)}>
          {workspace.icon}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{workspace.name}</span>
        <span className="truncate text-xs">
          {workspace.userDefault || workspace.members.length === 1
            ? "Personal"
            : "Shared"}
        </span>
      </div>
    </div>
  )
}
