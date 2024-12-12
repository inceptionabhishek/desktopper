import { Button, Modal, Spin, Progress } from "antd";
import React, { useEffect } from "react";
import { ReactInternetSpeedMeter } from "react-internet-meter";
import axios from "axios";
import Table from "react-bootstrap/Table";
const { shell } = window.require("electron");
const { ipcRenderer } = window.require("electron");
const fs = window.require("fs");
function UpdateModal({ isModalOpen, setIsModalOpen, handleCancel, handleOk }) {
  const [wifiSpeed, setwifiSpeed] = React.useState(0);
  const [download, setDownload] = React.useState(0);
  const [loader, setLoader] = React.useState(true);
  const [versionAvailable, setVersionAvailable] = React.useState(false);
  const [downloadStarted, setDownloadStarted] = React.useState(false);
  const [versionData, setVersionData] = React.useState(null);
  async function getLatestAppVersion() {
    try {
      const response = await axios.get(
        "https://auto-updater.desktopper.com/latest-version"
      );
      console.log(response, "response");
      return response.data.windows.prod.version;
    } catch (error) {
      console.error("Error while fetching the latest version:", error);
      throw error; // Rethrow the error to handle it in the calling function.
    }
  }
  const downloadMSIUpdatedFile = async () => {
    setDownloadStarted(true);
    await axios({
      url: `https://download.desktopper.com/files/prod/windows/desktopper-windows-v${versionData}.msi`,
      method: "GET",
      responseType: "blob", // important
      onDownloadProgress: (progressEvent) => {
        if (isModalOpen === false) return;
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setDownload(percentCompleted);
      },
    })
      .then((response) => {
        if (isModalOpen === false) return;
        // Create a temporary URL for the downloaded blob
        const blob = new Blob([response.data]);
        const blobUrl = URL.createObjectURL(blob);

        // Create an anchor element and trigger the download
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = "desktopper.msi"; // Specify the filename you want
        // Programmatically click the anchor to trigger the download
        anchor.click();
        // Clean up the temporary URL
        URL.revokeObjectURL(blobUrl);

        // wait for user to save the file then open it
        var filePath = "C:\\Users\\abhis\\Downloads\\desktopper.msi";
        // check if file exists
        var interval = setInterval(function() {
          if (fs.existsSync(filePath)) {
            shell.openPath(filePath);
            clearInterval(interval);
          }
        }, 1000);
        var interval2 = setInterval(function() {
          shell.openPath(filePath);
          clearInterval(interval2);
        }, 4000);
        setDownloadStarted(false);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkVersionAvailable = async () => {
    const appVersion = await ipcRenderer.invoke("get_current_app_version");
    console.log(appVersion, "version");
    try {
      const latestVersion = await getLatestAppVersion();
      console.log("latest version", latestVersion);

      if (latestVersion !== appVersion) {
        setVersionData(latestVersion);
        setVersionAvailable(true);
      } else {
        setVersionAvailable(false);
      }
    } catch (error) {
      console.error("Error while fetching the latest version:", error);
      // Handle the error as needed.
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
      checkVersionAvailable();
    }, 5000);
  }, []);
  return (
    <Modal
      title={
        <div className="modal_title">
          <h3 className="modal_title_text">Checking for Updates</h3>
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={null}
    >
      <div className="update-main-div">
        {loader ? (
          <>
            <Spin size="large" />
          </>
        ) : (
          <>
            {versionAvailable ? (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Version</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{versionData}</td>
                      <td>
                        <Button onClick={downloadMSIUpdatedFile}>
                          Download
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
                {downloadStarted && (
                  <>
                    <Progress
                      strokeColor={{
                        from: "#108ee9",
                        to: "#87d068",
                      }}
                      percent={download}
                      status="active"
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <p className="update-text">
                  No updates available. You are using the latest version of
                  desktopper
                </p>
              </>
            )}
          </>
        )}
        <div className="update-div">
          <ReactInternetSpeedMeter
            txtSubHeading="Internet is too slow"
            outputType="alert"
            customClassName={null}
            txtMainHeading="Opps..."
            pingInterval={4000}
            thresholdUnit="megabyte"
            threshold={1}
            imageUrl="https://desktopperscreenshots.s3.ap-south-1.amazonaws.com/001bb9d6-ce72-4cff-aaab-b32c69cffc03.png"
            downloadSize="1781287" //bytes
            callbackFunctionOnNetworkTest={(speed) => setwifiSpeed(speed)}
          />
          {wifiSpeed} mb/s
        </div>
      </div>
    </Modal>
  );
}

export default UpdateModal;
