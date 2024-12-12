import axios from "axios";
import API_URL from "../Constants";
export async function readWorkspace({ workspaceId }) {
  return await axios({
    url: `${API_URL}/admin/workspace/read/${workspaceId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("team-hub-token")}`,
    },
  });
}
