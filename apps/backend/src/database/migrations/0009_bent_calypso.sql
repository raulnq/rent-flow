CREATE TABLE "rent_flow"."propertyImages" (
	"propertyImageId" uuid PRIMARY KEY NOT NULL,
	"imageName" varchar(250) NOT NULL,
	"contentType" varchar(100) NOT NULL,
	"imagePath" varchar(500) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"propertyId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rent_flow"."propertyImages" ADD CONSTRAINT "propertyImages_propertyId_properties_propertyId_fk" FOREIGN KEY ("propertyId") REFERENCES "rent_flow"."properties"("propertyId") ON DELETE no action ON UPDATE no action;