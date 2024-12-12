import axios from "axios";
import API_URL from "../Constants";
export function fetchTotalTime({ userId }) {
  return axios({
    url: `${API_URL}/report/today/${userId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("team-hub-token")}`,
    },
  });
}
