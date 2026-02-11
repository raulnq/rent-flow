CREATE TABLE "rent_flow"."properties" (
	"propertyId" uuid PRIMARY KEY NOT NULL,
	"address" varchar(1000) NOT NULL,
	"propertyType" varchar(25) NOT NULL,
	"clientId" uuid NOT NULL,
	"rentalPrice" numeric(10, 2) NOT NULL,
	"numberOfRooms" integer NOT NULL,
	"numberOfBathrooms" integer NOT NULL,
	"numberOfGarages" integer NOT NULL,
	"totalArea" numeric(10, 2) NOT NULL,
	"description" varchar(5000),
	"constraints" varchar(5000),
	"latitude" double precision,
	"longitude" double precision
);
--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" ADD CONSTRAINT "properties_clientId_clients_clientId_fk" FOREIGN KEY ("clientId") REFERENCES "rent_flow"."clients"("clientId") ON DELETE no action ON UPDATE no action;