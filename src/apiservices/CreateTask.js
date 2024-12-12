import axios from "axios";
import API_URL from "../Constants";
export default async function createTask(data) {
  return await axios({
    url: `${API_URL}/user/task/create`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("team-hub-token")}`,
    },
    data: data,
  });
}
