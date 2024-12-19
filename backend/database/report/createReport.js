const { randomBytes } = require("crypto");

function generateReportId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "RID";

  for (let i = 0; i < 48; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }

  return id;
}

function calculateEfficiency(data) {
  const { idleTime, timeTracked } = data;
  const timeTrackedInSec = timeTracked / 1000;
  const totalActiveTime = timeTrackedInSec - idleTime;

  const efficiency =
    (totalActiveTime / (timeTrackedInSec ? timeTrackedInSec : 1)) * 100;

  console.log("efficiency:", efficiency);

  return efficiency.toFixed(2);
}

function calculateTotalWorkHoursCompleted(data) {
  const { idleTime, timeTracked } = data;
  const totalIdleTimeInSec = idleTime; // idleTime is already in seconds
  const totalActiveTimeInSec = timeTracked / 1000; // Convert timeTracked to seconds
  const totalActiveTimeInHour =
    (totalActiveTimeInSec - totalIdleTimeInSec) / 3600;

  // Convert totalActiveTimeInHour to hours, minutes, and seconds
  const hours = Math.floor(totalActiveTimeInHour);
  const minutes = Math.floor((totalActiveTimeInHour - hours) * 60);
  const seconds = Math.floor(((totalActiveTimeInHour - hours) * 3600) % 60);

  // Format the result as hours:minutes:seconds
  const formattedTime = `${hours}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  return formattedTime;
}
// Creating Report for user

const createReport = async (db, data) => {
  data.reportId = generateReportId();
  data.efficiency = calculateEfficiency(data);
  data.totalWorkHoursCompleted = calculateTotalWorkHoursCompleted(data);

    // Add timestamps
    const now = new Date();
    data.createdAt = now;
    data.updatedAt = now;

  const result = await db.collection("Reports").insertOne(data);
  if (!result)
    return { status: false, err: "An error occurred. Please try again" };
  return { status: true, data };
};

module.exports = { createReport };
