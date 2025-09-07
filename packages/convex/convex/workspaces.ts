import { v } from "convex/values"
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server"
import { UserJSON } from "@clerk/backend"
import { Doc, Id } from "./_generated/dataModel"
import { getCurrentUser } from "./users"
import { workspaceFields } from "./schema"

export const userWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx)
    if (!user) {
      return []
    }

    return await ctx.db
      .query("workspaces")

      .withIndex("by_owner", (q) => q.eq("ownerId", user!._id))
      .collect()
  },
})

export const createWorkspace = mutation({
  args: workspaceFields,
  handler: async (
    ctx,
    { ownerId, name, notes, background, icon, members, userDefault },
  ) => {
    const id = await ctx.db.insert("workspaces", {
      members,
      background,
      icon,
      ownerId,
      name,
      notes,
      userDefault,
    })

    return id
  },
})

export const updateWorkspace = mutation({
  args: v.object({
    id: v.id("workspaces"),
    values: v.object(workspaceFields),
  }),
  handler: async (ctx, { id, values }) => {
    await ctx.db.patch(id, values)
  },
})

export const deleteWorkspace = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, { id }: { id: Id<"workspaces"> }) => {
    await ctx.db.delete(id)
  },
})

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
      background: "bg-emerald-500",
      icon: "🚀",
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
