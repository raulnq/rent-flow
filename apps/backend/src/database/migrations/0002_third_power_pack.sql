CREATE TABLE "rent_flow"."leads" (
	"leadId" uuid PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"dni" varchar(20) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(100),
	"address" varchar(1000),
	CONSTRAINT "leads_dni_unique" UNIQUE("dni")
);
