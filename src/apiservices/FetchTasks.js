import axios from "axios";
import API_URL from "../Constants";
export function fetchTasks() {
  return axios({
    url: `${API_URL}/user/task/userData`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("team-hub-token")}`,
    },
  });
}
