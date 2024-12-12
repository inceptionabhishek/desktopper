import axios from "axios";
import API_URL from "../Constants";
export function verifyLoginToken() {
  const token = localStorage.getItem("team-hub-token");
  return axios({
    url: `${API_URL}/auth/verifylogin/${token}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("team-hub-token")}`,
    },
  });
}
