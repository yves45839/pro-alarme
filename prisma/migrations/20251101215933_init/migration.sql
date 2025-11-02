-- CreateEnum
CREATE TYPE "ProspectStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AlarmDeviceStatus" AS ENUM ('PENDING_INSTALLATION', 'INSTALLED', 'MAINTENANCE', 'RETIRED');

-- CreateEnum
CREATE TYPE "TechnicianVisitStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "MessageCategory" AS ENUM ('FORM_WELCOME', 'INSTALLATION', 'SUBSCRIPTION_REMINDER_5D', 'SUBSCRIPTION_REMINDER_2D', 'SUBSCRIPTION_REMINDER_DAY', 'RENEWAL_CONFIRMATION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPPORT');

-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT,
    "location" TEXT,
    "source" TEXT,
    "status" "ProspectStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "convertedAt" TIMESTAMP(3),
    "customerPhoneNumber" TEXT,

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "phoneNumber" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstSubscriptionAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("phoneNumber")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "customerPhoneNumber" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "planName" TEXT,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "renewalDate" TIMESTAMP(3),
    "firstSubscribedAt" TIMESTAMP(3),
    "lastRenewedAt" TIMESTAMP(3),
    "reminder5DaysSentAt" TIMESTAMP(3),
    "reminder2DaysSentAt" TIMESTAMP(3),
    "reminderSameDaySentAt" TIMESTAMP(3),
    "amount" DECIMAL(12,2),
    "alarmCentralSerial" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlarmDevice" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "model" TEXT,
    "status" "AlarmDeviceStatus" NOT NULL DEFAULT 'PENDING_INSTALLATION',
    "installedAt" TIMESTAMP(3),
    "location" TEXT,
    "notes" TEXT,
    "customerPhoneNumber" TEXT NOT NULL,
    "subscriptionId" TEXT,

    CONSTRAINT "AlarmDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicianVisit" (
    "id" TEXT NOT NULL,
    "customerPhoneNumber" TEXT NOT NULL,
    "alarmDeviceId" TEXT,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "status" "TechnicianVisitStatus" NOT NULL DEFAULT 'SCHEDULED',
    "technicianName" TEXT,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TechnicianVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageLog" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "category" "MessageCategory" NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'SMS',
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryStatus" TEXT,
    "metadata" JSONB,
    "prospectId" TEXT,
    "customerPhoneNumber" TEXT,
    "subscriptionId" TEXT,
    "technicianVisitId" TEXT,

    CONSTRAINT "MessageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "hashedPassword" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_phoneNumber_key" ON "Prospect"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_customerPhoneNumber_key" ON "Prospect"("customerPhoneNumber");

-- CreateIndex
CREATE INDEX "Subscription_customerPhoneNumber_idx" ON "Subscription"("customerPhoneNumber");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_renewalDate_idx" ON "Subscription"("renewalDate");

-- CreateIndex
CREATE UNIQUE INDEX "AlarmDevice_serialNumber_key" ON "AlarmDevice"("serialNumber");

-- CreateIndex
CREATE INDEX "AlarmDevice_customerPhoneNumber_idx" ON "AlarmDevice"("customerPhoneNumber");

-- CreateIndex
CREATE INDEX "AlarmDevice_subscriptionId_idx" ON "AlarmDevice"("subscriptionId");

-- CreateIndex
CREATE INDEX "TechnicianVisit_customerPhoneNumber_idx" ON "TechnicianVisit"("customerPhoneNumber");

-- CreateIndex
CREATE INDEX "TechnicianVisit_alarmDeviceId_idx" ON "TechnicianVisit"("alarmDeviceId");

-- CreateIndex
CREATE INDEX "TechnicianVisit_scheduledFor_idx" ON "TechnicianVisit"("scheduledFor");

-- CreateIndex
CREATE INDEX "MessageLog_phoneNumber_idx" ON "MessageLog"("phoneNumber");

-- CreateIndex
CREATE INDEX "MessageLog_category_idx" ON "MessageLog"("category");

-- CreateIndex
CREATE INDEX "MessageLog_customerPhoneNumber_idx" ON "MessageLog"("customerPhoneNumber");

-- CreateIndex
CREATE INDEX "MessageLog_subscriptionId_idx" ON "MessageLog"("subscriptionId");

-- CreateIndex
CREATE INDEX "MessageLog_technicianVisitId_idx" ON "MessageLog"("technicianVisitId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_customerPhoneNumber_fkey" FOREIGN KEY ("customerPhoneNumber") REFERENCES "Customer"("phoneNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_customerPhoneNumber_fkey" FOREIGN KEY ("customerPhoneNumber") REFERENCES "Customer"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlarmDevice" ADD CONSTRAINT "AlarmDevice_customerPhoneNumber_fkey" FOREIGN KEY ("customerPhoneNumber") REFERENCES "Customer"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlarmDevice" ADD CONSTRAINT "AlarmDevice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicianVisit" ADD CONSTRAINT "TechnicianVisit_customerPhoneNumber_fkey" FOREIGN KEY ("customerPhoneNumber") REFERENCES "Customer"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicianVisit" ADD CONSTRAINT "TechnicianVisit_alarmDeviceId_fkey" FOREIGN KEY ("alarmDeviceId") REFERENCES "AlarmDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageLog" ADD CONSTRAINT "MessageLog_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageLog" ADD CONSTRAINT "MessageLog_customerPhoneNumber_fkey" FOREIGN KEY ("customerPhoneNumber") REFERENCES "Customer"("phoneNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageLog" ADD CONSTRAINT "MessageLog_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageLog" ADD CONSTRAINT "MessageLog_technicianVisitId_fkey" FOREIGN KEY ("technicianVisitId") REFERENCES "TechnicianVisit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
