import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  workspaces: defineTable({
    name: v.string(),
    notes: v.optional(v.string()),
    ownerId: v.string(),
    members: v.array(v.string()),
  }).index("by_owner", ["ownerId"]),
  folders: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
    ownerId: v.string(),
    parentFolderId: v.optional(v.id("folders")),
    description: v.optional(v.string()),
    isArchived: v.boolean(),
    isPrivate: v.boolean(),
  })
    .index("by_workspace_parent", ["workspaceId", "parentFolderId"])
    .index("by_workspace_name", ["workspaceId", "name"])
    .index("by_owner", ["ownerId"]),
  bookmarks: defineTable({
    title: v.string(),
    url: v.string(),
    domain: v.string(),
    notes: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    folderId: v.optional(v.id("folders")),
    ownerId: v.string(),
    archived: v.boolean(),
    isPrivate: v.boolean(),
    favorited: v.boolean(),
    tags: v.array(v.string()),
    metadata: v.string(),
  })
    .index("by_workspace_folder", ["workspaceId", "folderId"])
    .index("by_owner", ["ownerId"])
    .index("by_url", ["workspaceId", "url"]),
})
