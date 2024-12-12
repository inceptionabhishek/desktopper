import axios from "axios";
import API_URL from "../Constants";
export function fetchTotalTimeForProjects({ projectId, date }) {
  return axios({
    url: `${API_URL}/project/${projectId}/${date}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("team-hub-token")}`,
    },
  });
}
