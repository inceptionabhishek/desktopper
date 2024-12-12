import axios from "axios";
import API_URL from "../Constants";
export function totalTimeTrackedForProjects({ date, projectId, userId }) {
  return axios({
    url: `${API_URL}/report/allReportsTimer/${date}/${projectId}/${userId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("team-hub-token")}`,
    },
  });
}
