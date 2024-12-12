import { combineReducers } from "redux";
import userReducer from "./user";
import projectsReducer from "./projects";
import tasksReducer from "./tasks";
import currentTaskReducer from "./currentTask";
import currentProjectReducer from "./currentProject";
import selectedTaskReducer from "./selectedTask";
import sessionReducer from "./session";
import workspaceDetailsReducer from "./workspaceDetails";
import projectTimeTrackedReducer from "./projectTimeTracked";
import userTotalTimeReducer from "./userTotalTime";
import lastUpdatedStatusReducer from "./lastUpdatedStatus";
import localStorageReducer from "./localStorage";
const rootReducer = combineReducers({
  user: userReducer,
  projects: projectsReducer,
  tasks: tasksReducer,
  currentTask: currentTaskReducer,
  currentProject: currentProjectReducer,
  selectedTask: selectedTaskReducer,
  session: sessionReducer,
  workspaceDetails: workspaceDetailsReducer,
  projectTimeTracked: projectTimeTrackedReducer,
  userTotalTime: userTotalTimeReducer,
  lastUpdatedStatus: lastUpdatedStatusReducer,
  localStorage: localStorageReducer,
});

export default rootReducer;
