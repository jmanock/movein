import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("homepage"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().defaultNow(),
});
