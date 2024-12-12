import axios from "axios";
import API_URL from "../Constants";
export function fetchWorkspace(workspaceId) {
  return axios({
    url: `${API_URL}/workspace/read/${workspaceId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("team-hub-token")}`,
    },
  });
}
