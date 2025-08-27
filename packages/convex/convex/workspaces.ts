import { v } from "convex/values"
import { internalMutation, mutation, QueryCtx } from "./_generated/server"
import { UserJSON } from "@clerk/backend"
import { Doc, Id } from "./_generated/dataModel"

export async function userDefaultWorkspaceQuery(
  ctx: QueryCtx,
  id: Id<"users">,
): Promise<Doc<"workspaces"> | null> {
  return await ctx.db
    .query("workspaces")
    .withIndex("by_owner", (q) => q.eq("ownerId", id))
    .filter((q) => q.eq(q.field("userDefault"), true))
    .unique()
}

export const createUserDefaultWorkspace = internalMutation({
  args: { id: v.id("users"), clerkUser: v.any() },
  async handler(
    ctx,
    { id, clerkUser }: { id: Id<"users">; clerkUser: UserJSON },
  ) {
    await ctx.db.insert("workspaces", {
      members: [id],
      name: `${clerkUser.first_name}'s Workspace`,
      ownerId: id,
      userDefault: true,
    })
  },
})

export const deleteUserDefaultWorkspace = internalMutation({
  args: { id: v.id("users") },
  async handler(ctx, { id }: { id: Id<"users"> }) {
    const workspace = await userDefaultWorkspaceQuery(ctx, id)
    if (workspace) {
      await ctx.db.delete(workspace._id)
    }
  },
})
