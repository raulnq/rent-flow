ALTER TABLE "rent_flow"."applications" ADD COLUMN "reservedAt" date;--> statement-breakpoint
ALTER TABLE "rent_flow"."applications" ADD COLUMN "reservedAmount" numeric(10, 2);