import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export const bookmarkFields = {
  name: v.string(),
  url: v.string(),
  domain: v.string(),
  notes: v.optional(v.string()),
  workspaceId: v.id("workspaces"),
  folderId: v.optional(v.id("folders")),
  ownerId: v.id("users"),
  archived: v.boolean(),
  isPrivate: v.boolean(),
  favorite: v.boolean(),
  tags: v.array(v.string()),
  metadata: v.string(),
}

export const readingsFields = {
  name: v.string(),
  url: v.string(),
  workspaceId: v.id("workspaces"),
  ownerId: v.id("users"),
  read: v.boolean(),
  metadata: v.string(),
}

export const foldersFields = {
  name: v.string(),
  workspaceId: v.id("workspaces"),
  ownerId: v.id("users"),
  parentFolderId: v.optional(v.id("folders")),
  notes: v.optional(v.string()),
  isArchived: v.boolean(),
  isPrivate: v.boolean(),
}

export const workspaceFields = {
  icon: v.string(),
  name: v.string(),
  notes: v.optional(v.string()),
  background: v.string(),
  userDefault: v.boolean(),
  ownerId: v.id("users"),
  members: v.array(v.id("users")),
}

export default defineSchema({
  users: defineTable({
    clerkUser: v.any(),
    color: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkUser.id"]),
  workspaces: defineTable(workspaceFields)
    .index("by_owner", ["ownerId"])
    .index("by_member", ["members"]),
  folders: defineTable(foldersFields)
    .index("by_workspace_id", ["workspaceId"])
    .index("by_owner", ["ownerId"]),
  bookmarks: defineTable(bookmarkFields)
    .index("by_workspace_id", ["workspaceId"])
    .index("by_owner", ["ownerId"])
    .index("by_url", ["workspaceId", "url"]),
  readings: defineTable(readingsFields)
    .index("by_workspace_id", ["workspaceId"])
    .index("by_owner", ["ownerId"])
    .index("by_url", ["workspaceId", "url"]),
})
