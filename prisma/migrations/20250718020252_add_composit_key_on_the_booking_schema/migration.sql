/*
  Warnings:

  - A unique constraint covering the columns `[classScheduleId,traineeId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Booking_classScheduleId_traineeId_key" ON "Booking"("classScheduleId", "traineeId");
