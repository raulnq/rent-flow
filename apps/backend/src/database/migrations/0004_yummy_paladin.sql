ALTER TABLE "rent_flow"."properties" RENAME COLUMN "numberOfRooms" TO "rooms";--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" RENAME COLUMN "numberOfBathrooms" TO "bathrooms";--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" RENAME COLUMN "numberOfGarages" TO "parkingSpaces";--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" ADD COLUMN "builtArea" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" ADD COLUMN "floorNumber" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" ADD COLUMN "yearBuilt" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" ADD COLUMN "maintenanceFee" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" ADD COLUMN "minimumContractMonths" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" ADD COLUMN "depositMonths" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" ADD COLUMN "hasElevator" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" ADD COLUMN "allowPets" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" ADD COLUMN "allowKids" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" ADD COLUMN "status" varchar(25) NOT NULL;--> statement-breakpoint
ALTER TABLE "rent_flow"."properties" DROP COLUMN "constraints";