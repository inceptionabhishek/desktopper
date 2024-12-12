import axios from "axios";
import API_URL from "../Constants";
export async function makeTaskCompleted(data) {
  // taskId,
  // taskStatus,
  return await axios({
    url: `${API_URL}/user/task/changeStatus`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("team-hub-token")}`,
    },
    data: data,
  });
}
