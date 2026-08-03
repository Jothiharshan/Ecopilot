CREATE TABLE "daily_records" (
	"id" text PRIMARY KEY NOT NULL,
	"factory_id" text NOT NULL,
	"date" text NOT NULL,
	"electricity_kwh" double precision NOT NULL,
	"water_liters" double precision NOT NULL,
	"production_output" double precision NOT NULL,
	"working_hours" double precision NOT NULL,
	"machine_utilization" double precision NOT NULL,
	"maintenance_cost" double precision NOT NULL,
	"operating_cost" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "factories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"industry_type" text NOT NULL,
	"number_of_machines" integer NOT NULL,
	"number_of_employees" integer NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" text NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"uid" text,
	"email" text NOT NULL,
	"full_name" text,
	"name" text,
	"role" text,
	"company_name" text,
	"password_hash" text,
	"created_at" text,
	"updated_at" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "daily_records" ADD CONSTRAINT "daily_records_factory_id_factories_id_fk" FOREIGN KEY ("factory_id") REFERENCES "public"."factories"("id") ON DELETE cascade ON UPDATE no action;