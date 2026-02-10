CREATE TABLE "rent_flow"."clients" (
	"clientId" uuid PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"dni" varchar(20) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(100),
	"address" varchar(1000),
	CONSTRAINT "clients_dni_unique" UNIQUE("dni")
);
