import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const contactStatusEnum = pgEnum('contact_status', [
  'new',
  'in_progress',
  'resolved',
  'spam',
])

export const abVariantEnum = pgEnum('ab_variant', ['A', 'B', 'C'])

export const contactSubmissions = pgTable(
  'contact_submissions',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 200 }).notNull(),
    body: varchar('body', { length: 2000 }).notNull(),
    status: contactStatusEnum('status').notNull().default('new'),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: varchar('user_agent', { length: 512 }),
    variant: abVariantEnum('variant'),
    idempotencyKey: varchar('idempotency_key', { length: 36 }).unique(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    // updatedAt は Drizzle が自動更新しない。別途トリガーをNeon SQL Editorで実行すること。
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    emailIdx: index('idx_contact_submissions_email')
      .on(table.email)
      .where(sql`${table.deletedAt} IS NULL`),
    createdAtIdx: index('idx_contact_submissions_created_at').on(
      table.createdAt
    ),
    variantIdx: index('idx_contact_submissions_variant').on(table.variant),
    emailCreatedAtIdx: index('idx_email_created_at')
      .on(table.email, table.createdAt)
      .where(sql`${table.deletedAt} IS NULL`),
    statusCreatedAtIdx: index('idx_status_created_at')
      .on(table.status, table.createdAt)
      .where(sql`${table.deletedAt} IS NULL`),
  })
)

export type ContactSubmission = typeof contactSubmissions.$inferSelect
export type NewContactSubmission = typeof contactSubmissions.$inferInsert
export type ContactStatus = (typeof contactStatusEnum.enumValues)[number]
export type AbVariant = (typeof abVariantEnum.enumValues)[number]
