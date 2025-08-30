import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkUser: v.any(),
    color: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkUser.id"]),
  workspaces: defineTable({
    name: v.string(),
    notes: v.optional(v.string()),
    userDefault: v.boolean(),
    ownerId: v.id("users"),
    members: v.array(v.id("users")),
  })
    .index("by_owner", ["ownerId"])
    .index("by_member", ["members"]),
  folders: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
    ownerId: v.id("users"),
    parentFolderId: v.optional(v.id("folders")),
    notes: v.optional(v.string()),
    isArchived: v.boolean(),
    isPrivate: v.boolean(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_owner", ["ownerId"]),
  bookmarks: defineTable({
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
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_owner", ["ownerId"])
    .index("by_url", ["workspaceId", "url"]),
})
