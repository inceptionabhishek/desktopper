import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import { WorkSpaceProvider } from "./context/WorkspaceContext";
import { ProjectProvider } from "./context/ProjectContext";
import { ReportProvider } from "./context/ReportContext";
import { UserProvider } from "./context/UserContext";
import { ProjectDetailsProvider } from "./context/ProjectDetailsContext";
import { TaskProvider } from "./context/TaskContext";
import { SupportProvider } from "./context/SupportContext";
import { PaymentProvider } from "./context/PaymentContext";

import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <WorkSpaceProvider>
      <ProjectProvider>
        <ProjectDetailsProvider>
          <TaskProvider>
            <ReportProvider>
              <UserProvider>
                <SupportProvider>
                  <PaymentProvider>
                    <App />
                    <Toaster />
                  </PaymentProvider>
                </SupportProvider>
              </UserProvider>
            </ReportProvider>
          </TaskProvider>
        </ProjectDetailsProvider>
      </ProjectProvider>
    </WorkSpaceProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
