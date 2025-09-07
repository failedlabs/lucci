import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { Id } from "./_generated/dataModel"
import { foldersFields } from "./schema"

export const workspaceFolders = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, { id }: { id: Id<"workspaces"> }) => {
    return await ctx.db
      .query("folders")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", id))
      .collect()
  },
})

export const createFolder = mutation({
  args: foldersFields,
  handler: async (
    ctx,
    {
      ownerId,
      isArchived,
      name,
      notes,
      isPrivate = false,
      workspaceId,
      parentFolderId,
    },
  ) => {
    const id = await ctx.db.insert("folders", {
      name,
      isArchived,
      isPrivate,
      ownerId,
      workspaceId,
      notes,
      parentFolderId,
    })

    return id
  },
})

export const updateFolder = mutation({
  args: v.object({
    id: v.id("folders"),
    values: v.object(foldersFields),
  }),
  handler: async (ctx, { id, values }) => {
    await ctx.db.patch(id, values)
  },
})

export const deleteFolder = mutation({
  args: {
    id: v.id("folders"),
  },
  handler: async (ctx, { id }: { id: Id<"folders"> }) => {
    await ctx.db.delete(id)
  },
})
