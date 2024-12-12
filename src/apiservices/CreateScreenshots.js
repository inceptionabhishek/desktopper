import axios from "axios";
import API_URL from "../Constants";
export async function createScreenshot(data) {
  return await axios({
    url: `${API_URL}/screenshot/create`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("team-hub-token")}`,
    },
    data: data,
  });
}
