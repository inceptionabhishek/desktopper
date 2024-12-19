import axios from "axios";
import React, { createContext, useState } from "react";

const ReportContext = createContext();

const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [allUserReports, setAllUserReports] = useState([]);
  const [membersReports, setMembersReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [
    memberReportsWithUserIdProjectId,
    setMemberReportsWithUserIdProjectId,
  ] = useState([]);
  const getReports = (projectId) => {
    setIsLoading(true);
    axios({
      url: `report/project/${projectId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;

        setReports([...Object.values(data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setReports([]);
        setIsLoading(false);
      });
  };

  const getAllReports = (userId) => {
    setIsLoading(true);
    axios({
      url: `report/user/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        setAllReports([...Object.values(response?.data?.reverse())]);
        setIsLoading(false);
      })
      .catch((e) => {
        setAllReports([]);
        setIsLoading(false);
      });
  };

  const getAllWeeklyReports = (userId, managerId, startTime, endTime) => {
    setIsLoading(true);
    axios({
      url: `report/user/${userId}/${managerId}/${startTime}/${endTime}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;
        setReports([...Object.values(data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setReports([]);
        setIsLoading(false);
      });
  };

  const getAllUserReports = (workspaceId) => {
    setIsLoading(true);
    axios({
      url: `report/getAllReports/${workspaceId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        setAllUserReports([...Object.values(response.data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const getMembersReports = (userId) => {
    setIsLoading(true);
    axios({
      url: `report/getMembersReports/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        setMembersReports([...Object.values(response.data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const getReportsWithDateAndUserIDandProjectId = (date, userId, projectId) => {
    setIsLoading(true);
    axios({
      url: `report/allReports/${date}/${projectId}/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        setMemberReportsWithUserIdProjectId([...Object.values(response.data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const getReportsByUserID = (userId, managerId, date) => {
    setIsLoading(true);
    axios({
      url: `report/userId/${userId}/${managerId}/${date}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        setMemberReportsWithUserIdProjectId([
          ...Object.values(response?.data?.todayReport?.data),
        ]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const ReportContextValue = {
    reports,
    allReports,
    allUserReports,
    membersReports,
    memberReportsWithUserIdProjectId,
    getAllReports,
    getAllUserReports,
    getMembersReports,
    setReports,
    getReports,
    getReportsWithDateAndUserIDandProjectId,
    isLoading,
    getAllWeeklyReports,
    getReportsByUserID,
    setAllUserReports,
  };
  return (
    <ReportContext.Provider value={ReportContextValue}>
      {children}
    </ReportContext.Provider>
  );
};

export { ReportContext, ReportProvider };
