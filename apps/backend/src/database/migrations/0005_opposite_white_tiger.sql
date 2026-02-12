CREATE TABLE "rent_flow"."applications" (
	"applicationId" uuid PRIMARY KEY NOT NULL,
	"leadId" uuid NOT NULL,
	"propertyId" uuid NOT NULL,
	"status" varchar(25) NOT NULL,
	"notes" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewStartedAt" date,
	"approvedAt" date,
	"rejectedAt" date,
	"rejectedReason" text,
	"withdrawnAt" date,
	"withdrawnReason" text,
	"contractSignedAt" date
);
--> statement-breakpoint
ALTER TABLE "rent_flow"."applications" ADD CONSTRAINT "applications_leadId_leads_leadId_fk" FOREIGN KEY ("leadId") REFERENCES "rent_flow"."leads"("leadId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rent_flow"."applications" ADD CONSTRAINT "applications_propertyId_properties_propertyId_fk" FOREIGN KEY ("propertyId") REFERENCES "rent_flow"."properties"("propertyId") ON DELETE no action ON UPDATE no action;