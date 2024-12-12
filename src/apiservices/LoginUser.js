import axios from "axios";
import API_URL from "../Constants";
const LoginUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export default LoginUser;
