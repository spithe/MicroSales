'use server';

import { db } from '@/lib/db';
import { expenses, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

// Helper to ensure user exists in DB
async function ensureUserExists(userId: string) {
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).get();

    if (!existingUser) {
        const user = await currentUser();
        if (user) {
            await db.insert(users).values({
                id: userId,
                clerkUserId: userId,
                email: user.emailAddresses[0]?.emailAddress || 'unknown@example.com',
                name: `${user.firstName} ${user.lastName}`.trim() || 'User',
                createdAt: new Date(),
            });
        }
    }
}

export async function getExpenses() {
    const { userId } = await auth();
    if (!userId) return [];

    await ensureUserExists(userId);

    const data = await db.select().from(expenses)
        .where(eq(expenses.userId, userId))
        .orderBy(desc(expenses.date));

    return data;
}

export async function createExpense(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await ensureUserExists(userId);

    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const amount = parseFloat(formData.get('amount') as string) || 0;
    const dateStr = formData.get('date') as string;
    const date = dateStr ? new Date(dateStr) : new Date();

    await db.insert(expenses).values({
        id: randomUUID(),
        userId,
        description,
        category,
        amount,
        date,
        createdAt: new Date(),
    });

    revalidatePath('/expenses');
}

export async function deleteExpense(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await db.delete(expenses)
        .where(eq(expenses.id, id));

    revalidatePath('/expenses');
}
