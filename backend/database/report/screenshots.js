const createScreenshot = async (db, screenshot) => {
  const result = await db.collection("Screenshots").insertOne(screenshot);
  return result;
};

const readScreenshots = async (db, data) => {
  try {
    const screenshotsCollection = db.collection("Screenshots");
    // Query the database to get screenshots within the specified time range
    console.log("userId:", data.userId);
    console.log("projectId:", data.projectId);
    console.log("taskId:", data.taskId);
    console.log("startTimeInDigits:", data.startTimeInDigits);
    console.log("endTimeInDigits:", data.endTimeInDigits);

    const screenshots = await screenshotsCollection
      .find({
        userId: data.userId,
        projectId: data.projectId,
        taskId: data.taskId,
        time: {
          $gte: data.startTimeInDigits,
        },
      })
      .toArray();

    const screenshotArray = [];
    for (let i = 0; i < screenshots.length; i++) {
      screenshotArray.push(screenshots[i].screenshotUrl);
    }
    console.log("Screenshots within the time range:", screenshotArray);
    return screenshotArray;
  } catch (error) {
    console.error("Error fetching screenshots:", error);
    return []; // Return an empty array or handle the error appropriately
  }
};

module.exports = { createScreenshot, readScreenshots };
