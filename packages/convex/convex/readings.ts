import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { Id } from "./_generated/dataModel"
import { readingsFields } from "./schema"

export const workspaceReadings = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, { id }: { id: Id<"workspaces"> }) => {
    return await ctx.db
      .query("readings")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", id))
      .collect()
  },
})

export const createReading = mutation({
  args: readingsFields,
  handler: async (
    ctx,
    { name, ownerId, workspaceId, url, metadata, read, domain },
  ) => {
    const id = await ctx.db.insert("readings", {
      metadata,
      name,
      ownerId,
      read,
      url,
      workspaceId,
      domain,
    })

    return id
  },
})

export const updateReading = mutation({
  args: {
    id: v.id("readings"),
    values: v.object(readingsFields),
  },
  handler: async (ctx, { id, values }) => {
    await ctx.db.patch(id, values)
  },
})

export const deleteReading = mutation({
  args: {
    id: v.id("readings"),
  },
  handler: async (ctx, { id }: { id: Id<"readings"> }) => {
    await ctx.db.delete(id)
  },
})
