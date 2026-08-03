import { pgTable, serial, text, integer, doublePrecision, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  uid: text("uid"),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  name: text("name"),
  role: text("role"),
  companyName: text("company_name"),
  passwordHash: text("password_hash"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: text("created_at").notNull(),
});

export const factories = pgTable("factories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  industryType: text("industry_type").notNull(),
  numberOfMachines: integer("number_of_machines").notNull(),
  numberOfEmployees: integer("number_of_employees").notNull(),
  createdAt: text("created_at").notNull(),
});

export const dailyRecords = pgTable("daily_records", {
  id: text("id").primaryKey(),
  factoryId: text("factory_id")
    .references(() => factories.id, { onDelete: "cascade" })
    .notNull(),
  date: text("date").notNull(),
  electricityKwh: doublePrecision("electricity_kwh").notNull(),
  waterLiters: doublePrecision("water_liters").notNull(),
  productionOutput: doublePrecision("production_output").notNull(),
  workingHours: doublePrecision("working_hours").notNull(),
  machineUtilization: doublePrecision("machine_utilization").notNull(),
  maintenanceCost: doublePrecision("maintenance_cost").notNull(),
  operatingCost: doublePrecision("operating_cost").notNull(),
});
