CREATE TABLE "rent_flow"."visits" (
	"visitId" uuid PRIMARY KEY NOT NULL,
	"applicationId" uuid NOT NULL,
	"status" varchar(25) NOT NULL,
	"scheduledAt" timestamp with time zone NOT NULL,
	"notes" text,
	"cancellationReason" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rent_flow"."visits" ADD CONSTRAINT "visits_applicationId_applications_applicationId_fk" FOREIGN KEY ("applicationId") REFERENCES "rent_flow"."applications"("applicationId") ON DELETE no action ON UPDATE no action;