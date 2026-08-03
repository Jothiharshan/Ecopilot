import { db } from "./index";
import { factories, dailyRecords, users, passwordResetTokens } from "./schema";
import { eq } from "drizzle-orm";

export async function getAllFactoriesDb() {
  try {
    return await db.select().from(factories);
  } catch (error) {
    console.error("Cloud SQL query error (getAllFactoriesDb):", error);
    throw new Error("Failed to query factories from Cloud SQL", { cause: error });
  }
}

export async function insertFactoryDb(factory: typeof factories.$inferInsert) {
  try {
    const result = await db.insert(factories).values(factory).returning();
    return result[0];
  } catch (error) {
    console.error("Cloud SQL insert error (insertFactoryDb):", error);
    throw new Error("Failed to insert factory into Cloud SQL", { cause: error });
  }
}

export async function updateFactoryDb(id: string, factoryData: Partial<typeof factories.$inferInsert>) {
  try {
    const result = await db
      .update(factories)
      .set(factoryData)
      .where(eq(factories.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error("Cloud SQL update error (updateFactoryDb):", error);
    throw new Error("Failed to update factory in Cloud SQL", { cause: error });
  }
}

export async function deleteFactoryDb(id: string) {
  try {
    await db.delete(factories).where(eq(factories.id, id));
  } catch (error) {
    console.error("Cloud SQL delete error (deleteFactoryDb):", error);
    throw new Error("Failed to delete factory from Cloud SQL", { cause: error });
  }
}

export async function getDailyRecordsByFactoryDb(factoryId: string) {
  try {
    return await db.select().from(dailyRecords).where(eq(dailyRecords.factoryId, factoryId));
  } catch (error) {
    console.error("Cloud SQL query error (getDailyRecordsByFactoryDb):", error);
    throw new Error("Failed to fetch daily records from Cloud SQL", { cause: error });
  }
}

export async function saveDailyRecordDb(record: typeof dailyRecords.$inferInsert) {
  try {
    const { id, ...updateFields } = record;
    const result = await db
      .insert(dailyRecords)
      .values(record)
      .onConflictDoUpdate({
        target: dailyRecords.id,
        set: updateFields,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Cloud SQL save error (saveDailyRecordDb):", error);
    throw new Error("Failed to save daily record into Cloud SQL", { cause: error });
  }
}

export async function saveDailyRecordsBatchDb(recordsList: (typeof dailyRecords.$inferInsert)[]) {
  try {
    if (recordsList.length === 0) return;
    for (const record of recordsList) {
      const { id, ...updateFields } = record;
      await db
        .insert(dailyRecords)
        .values(record)
        .onConflictDoUpdate({
          target: dailyRecords.id,
          set: updateFields,
        });
    }
  } catch (error) {
    console.error("Cloud SQL batch save error (saveDailyRecordsBatchDb):", error);
    throw new Error("Failed to batch save daily records into Cloud SQL", { cause: error });
  }
}

export async function deleteDailyRecordDb(recordId: string) {
  try {
    await db.delete(dailyRecords).where(eq(dailyRecords.id, recordId));
  } catch (error) {
    console.error("Cloud SQL delete error (deleteDailyRecordDb):", error);
    throw new Error("Failed to delete daily record from Cloud SQL", { cause: error });
  }
}

export async function getAllUsersDb() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error("Cloud SQL query error (getAllUsersDb):", error);
    return [];
  }
}

export async function saveUserDb(userData: typeof users.$inferInsert) {
  try {
    const { id, ...updateFields } = userData;
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: updateFields,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Cloud SQL save error (saveUserDb):", error);
    return null;
  }
}

export async function saveResetTokenDb(tokenData: typeof passwordResetTokens.$inferInsert) {
  try {
    const { id, ...updateFields } = tokenData;
    const result = await db
      .insert(passwordResetTokens)
      .values(tokenData)
      .onConflictDoUpdate({
        target: passwordResetTokens.id,
        set: updateFields,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Cloud SQL save error (saveResetTokenDb):", error);
    return null;
  }
}

export async function getAllResetTokensDb() {
  try {
    return await db.select().from(passwordResetTokens);
  } catch (error) {
    console.error("Cloud SQL query error (getAllResetTokensDb):", error);
    return [];
  }
}
