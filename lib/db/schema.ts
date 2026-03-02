import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    clerkUserId: text('clerk_user_id').unique().notNull(),
    email: text('email').notNull(),
    name: text('name'),
    avatarUrl: text('avatar_url'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    lastSeenAt: integer('last_seen_at', { mode: 'timestamp' }),
});

export const leads = sqliteTable('leads', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    company: text('company'),

    // CRM / Spreadsheet Fields
    status: text('status').default('New'), // New, Contacted, Proposal, Won, Lost
    lastContact: integer('last_contact', { mode: 'timestamp' }),

    estimatedValue: real('estimated_value').default(0),

    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const expenses = sqliteTable('expenses', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

    description: text('description').notNull(),
    amount: real('amount').notNull(),
    category: text('category').notNull(), // Marketing, Software, Office, Travel, etc.
    date: integer('date', { mode: 'timestamp' }).notNull(),

    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const activities = sqliteTable('activities', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    leadId: text('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),

    type: text('type').notNull(),
    content: text('content'),
    metadata: text('metadata'), // JSON stringified

    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
