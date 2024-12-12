import axios from "axios";
import API_URL from "../Constants";
export function createReport(data) {
  return axios({
    url: `${API_URL}/report/createReport`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("team-hub-token")}`,
    },
    data: data,
  });
}
