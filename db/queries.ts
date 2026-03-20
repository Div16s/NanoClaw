import { and, eq } from "drizzle-orm";
import { db } from "./";
import {
  integrations,
  users,
} from "./schema";
import { GoogleProvider } from "@/lib/google";

export async function getUserByClerkId(clerkId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);
  return user ?? null;
}

export async function getOrCreateUser(
  clerkId: string,
  email: string,
  name?: string,
) {
  const existing = await getUserByClerkId(clerkId);
  if (existing) {
    return existing;
  }

  const [user] = await db
    .insert(users)
    .values({ clerkId, email, name: name ?? null })
    .returning();

  return user;
}

export async function getIntegration(userId: string, provider: GoogleProvider) {
  const [integration] = await db
    .select()
    .from(integrations)
    .where(
      and(eq(integrations.userId, userId), eq(integrations.provider, provider)),
    )
    .limit(1);
  return integration ?? null;
}

export async function upsertIntegration(data: {
  userId: string;
  provider: GoogleProvider;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  scope: string[];
}) {
  const existing = await getIntegration(data.userId, data.provider);
  if (existing) {
    await db
      .update(integrations)
      .set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        scope: data.scope,
      })
      .where(eq(integrations.id, existing.id));
    return existing;
  }

  const [result] = await db
    .insert(integrations)
    .values(data)
    .returning({ id: integrations.id });
  return result.id;
}

export async function getUserIntegrations(userId: string) {
  const results = await db
    .select()
    .from(integrations)
    .where(eq(integrations.userId, userId));
  return results ?? [];
}
