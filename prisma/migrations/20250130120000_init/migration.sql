-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prospectPhoneNumber" TEXT UNIQUE,
    CONSTRAINT "Customer_prospectPhoneNumber_fkey" FOREIGN KEY ("prospectPhoneNumber") REFERENCES "Prospect" ("phoneNumber") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "renewalDate" DATETIME NOT NULL,
    "endsAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AlarmDevice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "model" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_INSTALLATION',
    "installedAt" DATETIME,
    "lastServiceAt" DATETIME,
    "notes" TEXT,
    CONSTRAINT "AlarmDevice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MessageLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phoneNumber" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" DATETIME,
    "metadata" TEXT,
    "customerPhoneNumber" TEXT,
    "prospectPhoneNumber" TEXT,
    CONSTRAINT "MessageLog_customerPhoneNumber_fkey" FOREIGN KEY ("customerPhoneNumber") REFERENCES "Customer" ("phoneNumber") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MessageLog_prospectPhoneNumber_fkey" FOREIGN KEY ("prospectPhoneNumber") REFERENCES "Prospect" ("phoneNumber") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_phoneNumber_key" ON "Prospect"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phoneNumber_key" ON "Customer"("phoneNumber");

-- CreateIndex
CREATE INDEX "subscription_customer_idx" ON "Subscription"("customerId");

-- CreateIndex
CREATE INDEX "subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AlarmDevice_serialNumber_key" ON "AlarmDevice"("serialNumber");

-- CreateIndex
CREATE INDEX "device_customer_idx" ON "AlarmDevice"("customerId");

-- CreateIndex
CREATE INDEX "device_status_idx" ON "AlarmDevice"("status");

-- CreateIndex
CREATE INDEX "message_phone_idx" ON "MessageLog"("phoneNumber");

-- CreateIndex
CREATE INDEX "message_customer_phone_idx" ON "MessageLog"("customerPhoneNumber");

-- CreateIndex
CREATE INDEX "message_prospect_phone_idx" ON "MessageLog"("prospectPhoneNumber");
