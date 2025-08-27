import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server"

import { v } from "convex/values"
import { Doc, Id } from "./_generated/dataModel"
import { UserJSON } from "@clerk/backend"

/**
 * Whether the current user is fully logged in, including having their information
 * synced from Clerk via webhook.
 *
 * Like all Convex queries, errors on expired Clerk token.
 */
export const userLoginStatus = query(
  async (
    ctx,
  ): Promise<
    | ["No JWT Token", null]
    | ["No Clerk User", null]
    | ["Logged In", Doc<"users">]
  > => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return ["No JWT Token", null]
    }
    const user = await getCurrentUser(ctx)
    if (user === null) {
      return ["No Clerk User", null]
    }
    return ["Logged In", user]
  },
)

export const currentUser = query((ctx: QueryCtx) => getCurrentUser(ctx))

export const getUser = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args) {
    return await userQuery(ctx, args.subject)
  },
})

export const updateOrCreateUser = internalMutation({
  args: { clerkUser: v.any() }, // no runtime validation, trust Clerk
  async handler(ctx, { clerkUser }: { clerkUser: UserJSON }) {
    const userRecord = await userQuery(ctx, clerkUser.id)

    let id: Id<"users">
    if (userRecord === null) {
      const colors = ["red", "green", "blue"]
      const color = colors[Math.floor(Math.random() * colors.length)]
      const newId = await ctx.db.insert("users", { clerkUser, color })
      id = newId
    } else {
      await ctx.db.patch(userRecord._id, { clerkUser })
      id = userRecord._id
    }

    return id
  },
})

export const deleteUser = internalMutation({
  args: { id: v.string() },
  async handler(ctx, { id }) {
    const userRecord = await userQuery(ctx, id)

    if (userRecord === null) {
      console.warn("can't delete user, does not exist", id)
    } else {
      await ctx.db.delete(userRecord._id)
    }
  },
})

export const setColor = mutation({
  args: { color: v.string() },
  handler: async (ctx, { color }) => {
    const user = await mustGetCurrentUser(ctx)
    await ctx.db.patch(user._id, { color })
  },
})

export async function userQuery(
  ctx: QueryCtx,
  clerkUserId: string,
): Promise<(Omit<Doc<"users">, "clerkUser"> & { clerkUser: UserJSON }) | null> {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkUser.id", clerkUserId))
    .unique()
}

export async function userById(
  ctx: QueryCtx,
  id: Id<"users">,
): Promise<(Omit<Doc<"users">, "clerkUser"> & { clerkUser: UserJSON }) | null> {
  return await ctx.db.get(id)
}

async function getCurrentUser(ctx: QueryCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity()
  if (identity === null) {
    return null
  }
  return await userQuery(ctx, identity.subject)
}

export async function mustGetCurrentUser(ctx: QueryCtx): Promise<Doc<"users">> {
  const userRecord = await getCurrentUser(ctx)
  if (!userRecord) throw new Error("Can't get current user")
  return userRecord
}
