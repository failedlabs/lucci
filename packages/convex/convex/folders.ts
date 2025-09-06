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
  args: {
    userId: v.id("users"),
    name: v.string(),
    notes: v.optional(v.string()),
    isPrivate: v.optional(v.boolean()),
    isArchived: v.optional(v.boolean()),
    folderId: v.id("folders"),
    parentFolderId: v.optional(v.id("folders")),
  },
  handler: async (
    ctx,
    {
      name,
      notes,
      isPrivate = false,
      folderId,
      parentFolderId,
      isArchived = false,
    }: {
      folderId: Id<"folders">
      userId: Id<"users">
      name: string
      notes?: string
      parentFolderId?: Id<"folders">
      isPrivate?: boolean
      isArchived?: boolean
    },
  ) => {
    await ctx.db.patch(folderId, {
      name,
      isArchived,
      isPrivate,
      notes,
      parentFolderId,
    })
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
