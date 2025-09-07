import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { Id } from "./_generated/dataModel"
import { bookmarkFields } from "./schema"

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
  args: bookmarkFields,
  handler: async (
    ctx,
    {
      name,
      archived,
      ownerId,
      notes,
      isPrivate = false,
      workspaceId,
      tags,
      url,
      domain,
      favorite = false,
      folderId,
      metadata,
    },
  ) => {
    const id = await ctx.db.insert("bookmarks", {
      domain,
      favorite,
      isPrivate,
      metadata,
      ownerId,
      archived,
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
    id: v.id("bookmarks"),
    values: v.object(bookmarkFields),
  },
  handler: async (ctx, { id, values }) => {
    await ctx.db.patch(id, values)
  },
})

export const deleteBookmark = mutation({
  args: {
    id: v.id("bookmarks"),
  },
  handler: async (ctx, { id }: { id: Id<"bookmarks"> }) => {
    await ctx.db.delete(id)
  },
})
