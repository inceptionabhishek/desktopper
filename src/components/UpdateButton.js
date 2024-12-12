// UpdateButton.js

import React, { useState } from "react";
const { ipcRenderer } = window.require("electron");

const UpdateButton = () => {
  const [updateStatus, setUpdateStatus] = useState("");

  const handleUpdateClick = () => {
    ipcRenderer.send("check-for-updates");
  };

  ipcRenderer.on("update-available", () => {
    setUpdateStatus("An update is available. Downloading...");
  });

  ipcRenderer.on("update-downloaded", () => {
    setUpdateStatus(
      "Update has been downloaded. Restart the app to apply changes."
    );
  });

  ipcRenderer.on("update-not-available", () => {
    setUpdateStatus("No update available.");
  });

  return (
    <div>
      <button onClick={handleUpdateClick}>Check for Updates</button>
      <p>{updateStatus}</p>
    </div>
  );
};

export default UpdateButton;
