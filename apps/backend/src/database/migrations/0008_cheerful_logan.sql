CREATE TABLE "rent_flow"."applicationDocuments" (
	"applicationDocumentId" uuid PRIMARY KEY NOT NULL,
	"applicationId" uuid NOT NULL,
	"fileName" varchar(250) NOT NULL,
	"contentType" varchar(100) NOT NULL,
	"filePath" varchar(500) NOT NULL,
	"documentType" varchar(250) NOT NULL,
	"notes" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rent_flow"."applicationDocuments" ADD CONSTRAINT "applicationDocuments_applicationId_applications_applicationId_fk" FOREIGN KEY ("applicationId") REFERENCES "rent_flow"."applications"("applicationId") ON DELETE no action ON UPDATE no action;