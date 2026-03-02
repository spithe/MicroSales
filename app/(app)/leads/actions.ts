'use server';

import { db } from '@/lib/db';
import { leads, users } from '@/lib/db/schema';
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

export async function getLeads() {
    const { userId } = await auth();
    if (!userId) return [];

    await ensureUserExists(userId); // Ensure user is in DB when loading dashboard too

    const data = await db.select().from(leads)
        .where(eq(leads.userId, userId))
        .orderBy(desc(leads.createdAt));

    return data;
}

export async function createLead(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await ensureUserExists(userId);

    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const status = formData.get('status') as string || 'New';
    const estimatedValue = parseFloat(formData.get('estimatedValue') as string) || 0;

    await db.insert(leads).values({
        id: randomUUID(),
        userId,
        name,
        company,
        email,
        phone,
        status,
        estimatedValue,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    revalidatePath('/leads');
}

export async function deleteLead(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await db.delete(leads)
        .where(eq(leads.id, id));

    revalidatePath('/leads');
}
