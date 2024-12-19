import "./App.css";
import { useContext, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import jwt_decode from "jwt-decode";
import { toast } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import CreateWorkspace from "./pages/Workspace/CreateWorkspace";
import InviteWorkspace from "./pages/Workspace/InviteWorkspace";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./pages/NotFound/NotFound";
import InviteScreen from "./pages/InviteScreen/InviteScreen";
import { AuthContext } from "./context/AuthContext";
import { UserContext } from "./context/UserContext";
import { WorkSpaceContext } from "./context/WorkspaceContext";
import { PaymentContext } from "./context/PaymentContext";
import { ReportContext } from "./context/ReportContext";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ChangeWorkspace from "./pages/Workspace/ChangeWorkspace";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import VerifyToken from "./pages/VerifyEmail/VerifyToken";
import ManageSubscription from "./pages/Payment/ManageSubscription";
import ThankYou from "./pages/Payment/ThankYouPage";

const PrivateRoute = ({ children }) => {
  const { setUser } = useContext(AuthContext);

  const userData = localStorage.getItem("team-hub-user");
  const userToken = localStorage.getItem("team-hub-token");

  if (userData) {
    if (userToken) {
      const decodedToken = jwt_decode(userToken);
      const accessToken = jwt_decode(decodedToken.accessToken);

      if (accessToken.exp && Date.now() >= accessToken.exp * 1000) {
        toast.error("Please login again!");
        localStorage.removeItem("team-hub-user");
        localStorage.removeItem("team-hub-token");
        localStorage.removeItem("team-hub-workspace");

        setUser(null);
        return <Navigate to={"/login"} replace />;
      } else {
        return children;
      }
    } else {
      localStorage.removeItem("team-hub-workspace");
      setUser(null);
      return <Navigate to={"/login"} replace />;
    }
  } else {
    localStorage.removeItem("team-hub-token");
    localStorage.removeItem("team-hub-workspace");
    setUser(null);
    return <Navigate to={"/login"} replace />;
  }
};

function App() {
  const { superAdmin, getSuperAdmin, getUserLocation } =
    useContext(UserContext);
  const { workspaceMembers, getWorkSpaceInfo } = useContext(WorkSpaceContext);
  const { viewSubscription, getCustomer } = useContext(PaymentContext);
  const { getAllReports } = useContext(ReportContext);

  useEffect(() => {
    const storeData = localStorage.getItem("team-hub-user");
    if (storeData) {
      const userValueData = JSON.parse(storeData);
      if (userValueData?.userId) {
        getUserLocation();
        getSuperAdmin(userValueData?.userId);
        getAllReports(userValueData?.userId);
        getWorkSpaceInfo(userValueData?.workspaceId);
      }
    }
  }, [localStorage.getItem("team-hub-user")]);

  useEffect(() => {
    if (superAdmin?.email && workspaceMembers.length > 0) {
      getCustomer(superAdmin?.email);
      viewSubscription(superAdmin?.email, workspaceMembers);
    }
  }, [superAdmin, workspaceMembers]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={Signup} />
        <Route path="/forgotpassword" Component={ForgotPassword} />
        <Route path="/verifyemail" Component={VerifyEmail} />
        <Route path="/verify/:token" Component={VerifyToken} />
        <Route
          path="/create-workspace"
          element={
            <PrivateRoute>
              <CreateWorkspace />
            </PrivateRoute>
          }
        />
        <Route
          path="/invite-workspace"
          element={
            <PrivateRoute>
              <InviteWorkspace />
            </PrivateRoute>
          }
        />
        <Route
          path="/change-workspace/:profileId"
          element={
            <PrivateRoute>
              <ChangeWorkspace />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/invite-screen"
          element={
            <PrivateRoute>
              <InviteScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/subscription"
          element={
            <PrivateRoute>
              <ManageSubscription />
            </PrivateRoute>
          }
        />

        <Route
          path="success"
          element={
            <PrivateRoute>
              <ThankYou />
            </PrivateRoute>
          }
        />

        <Route path="*" Component={NotFound} />
      </Routes>
    </Router>
  );
}

export default App;
