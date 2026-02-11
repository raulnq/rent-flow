ALTER TABLE "rent_flow"."leads" ADD COLUMN "birthDate" date;--> statement-breakpoint
ALTER TABLE "rent_flow"."leads" ADD COLUMN "occupation" varchar(100);--> statement-breakpoint
ALTER TABLE "rent_flow"."leads" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "rent_flow"."leads" ADD COLUMN "nationality" varchar(50);