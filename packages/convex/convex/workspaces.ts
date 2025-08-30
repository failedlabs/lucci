import { v } from "convex/values"
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server"
import { UserJSON } from "@clerk/backend"
import { Doc, Id } from "./_generated/dataModel"

export const userWorkspaces = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, { id }: { id: Id<"users"> }) => {
    return await ctx.db
      .query("workspaces")

      // @ts-expect-error Error with convex library, TODO: solve this later
      .withIndex("by_member", (q) => q.eq("members", id))
      .collect()
  },
})

export const createWorkspace = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (
    ctx,
    {
      userId,
      name,
      notes,
    }: { userId: Id<"users">; name: string; notes?: string },
  ) => {
    const id = await ctx.db.insert("workspaces", {
      members: [userId],
      ownerId: userId,
      name,
      notes,
      userDefault: false,
    })

    return id
  },
})

export const updateWorkspace = mutation({
  args: {
    id: v.id("workspaces"),
    members: v.optional(v.array(v.id("users"))),
    name: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (
    ctx,
    {
      id: workspaceId,
      name,
      notes,
      members,
    }: {
      id: Id<"workspaces">
      name?: string
      notes?: string
      members?: Id<"users">[]
    },
  ) => {
    await ctx.db.patch(workspaceId, {
      name,
      notes,
      members,
    })
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
