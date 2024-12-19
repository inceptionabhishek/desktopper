import { ReportContext } from "../../../context/ReportContext";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RecentActivity = ({
  setModal,
  setSelectedScreenshot,
  setScreenshotData,
}) => {
  const { allReports } = useContext(ReportContext);

  const [imageURLs, setImageURLs] = useState([]);

  useEffect(() => {
    const generateImageURLs = () => {
      const newImageURLs = [];

      const sortingReport = allReports;

      const sortedReports = sortingReport.sort((a, b) => {
        const aEndTime = new Date(a.endTime).getTime();
        const bEndTime = new Date(b.endTime).getTime();
        return bEndTime - aEndTime;
      });

      sortedReports.forEach((report) => {
        report.screenshot.forEach((item) => {
          newImageURLs.push({
            imageURL: item.screenshotUrl,
            efficiency: report.efficiency,
            screenshotTime: item.screenshotTime,
            taskName: report.taskName,
            projectName: report.projectName,
          });
        });
      });

      return newImageURLs;
    };

    const newImageURLs = generateImageURLs();
    setImageURLs(newImageURLs);
  }, [allReports]);
  const getCircleColor = (efficiency) => {
    if (efficiency <= 20) {
      return "#FF6969";
    } else if (efficiency <= 70) {
      return "#EE9322";
    } else {
      return "#79AC78";
    }
  };

  return (
    <>
      <div className="w-full border border-gray-400 border-opacity-50 rounded-lg overflow-auto shadow-md">
        <div className="flex sticky top-0 bg-white w-full h-20 justify-between  border-b border-gray-400 border-opacity-50">
          <p className="flex ml-4 justify-center items-center text-gray-500 font-medium">
            RECENT ACTIVITY
          </p>
          <Link
            to="/dashboard/reports"
            className="flex mr-4 justify-center items-center text-blue-400 cursor-pointer hover:text-blue-500 font-medium"
          >
            View Activity
          </Link>
        </div>
        {imageURLs?.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 text-lg">No images found</p>
          </div>
        ) : (
          <div className="py-10 px-4">
            <div className="h-full grid grid-cols-3 gap-4">
              {imageURLs?.slice(0, 6).map((item, index) => (
                <div
                  className="h-28 p-4 flex justify-center items-center hover:cursor-pointer"
                  onClick={() => {
                    setModal(true);
                    setSelectedScreenshot(item?.imageURL);
                    setScreenshotData({
                      efficiency: item?.efficiency,
                      screenshotTime: item?.screenshotTime,
                      taskName: item?.taskName,
                      projectName: item?.projectName,
                    });
                  }}
                >
                  <div
                    className="relative overflow-visible"
                    style={{ background: "red" }}
                  >
                    <img
                      key={index}
                      src={item?.imageURL}
                      className="object-contain"
                      alt="Recent"
                    />
                    <div
                      className="absolute rounded-full w-6 h-6 text-white text-xs flex items-center justify-center"
                      style={{
                        top: "-0.10rem",
                        right: "-0.8rem",
                        backgroundColor: getCircleColor(
                          Math.floor(
                            item?.efficiency > 0 ? item?.efficiency : 0
                          )
                        ),
                      }}
                    >
                      {Math.floor(item?.efficiency > 0 ? item?.efficiency : 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RecentActivity;
