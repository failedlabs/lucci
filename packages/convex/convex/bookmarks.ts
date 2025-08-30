import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { Id } from "./_generated/dataModel"

export const workspaceBookmarks = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, { id }: { id: Id<"workspaces"> }) => {
    return await ctx.db
      .query("bookmarks")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", id))
      .collect()
  },
})

export const createBookmark = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    notes: v.optional(v.string()),
    isPrivate: v.optional(v.boolean()),
    workspaceId: v.id("workspaces"),
    tags: v.array(v.string()),
    url: v.string(),
    domain: v.string(),
    favorite: v.optional(v.boolean()),
    folderId: v.optional(v.id("folders")),
    metadata: v.string(),
  },
  handler: async (
    ctx,
    {
      userId,
      name,
      notes,
      isPrivate = false,
      workspaceId,
      tags,
      url,
      domain,
      favorite = false,
      folderId,
      metadata,
    }: {
      userId: Id<"users">
      name: string
      notes?: string
      isPrivate?: boolean
      workspaceId: Id<"workspaces">
      domain: string
      favorite?: boolean
      metadata: string
      tags: string[]
      url: string
      folderId?: Id<"folders">
    },
  ) => {
    const id = await ctx.db.insert("bookmarks", {
      archived: false,
      domain,
      favorite,
      isPrivate,
      metadata,
      ownerId: userId,
      tags,
      name,
      url,
      workspaceId,
      folderId,
      notes,
    })

    return id
  },
})

export const updateBookmark = mutation({
  args: {
    name: v.string(),
    notes: v.optional(v.string()),
    isPrivate: v.optional(v.boolean()),
    bookmarkId: v.id("bookmarks"),
    workspaceId: v.id("workspaces"),
    tags: v.array(v.string()),
    url: v.string(),
    domain: v.string(),
    favorite: v.optional(v.boolean()),
    folderId: v.optional(v.id("folders")),
    metadata: v.string(),
  },
  handler: async (
    ctx,
    {
      bookmarkId,
      name,
      notes,
      isPrivate = false,
      tags,
      url,
      domain,
      favorite = false,
      folderId,
      metadata,
    }: {
      bookmarkId: Id<"bookmarks">
      name: string
      notes?: string
      isPrivate?: boolean
      domain: string
      favorite?: boolean
      metadata: string
      tags: string[]
      url: string
      folderId?: Id<"folders">
    },
  ) => {
    await ctx.db.patch(bookmarkId, {
      archived: false,
      domain,
      favorite,
      isPrivate,
      metadata,
      tags,
      name,
      url,
      folderId,
      notes,
    })
  },
})

export const deleteFolder = mutation({
  args: {
    id: v.id("bookmarks"),
  },
  handler: async (ctx, { id }: { id: Id<"bookmarks"> }) => {
    await ctx.db.delete(id)
  },
})
