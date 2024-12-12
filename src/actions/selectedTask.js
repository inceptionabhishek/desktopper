export const SET_SELECTED_TASK = "SET_SELECTED_TASK";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";

export const setSelectedTask = (selectedTask) => {
  return {
    type: SET_SELECTED_TASK,
    payload: selectedTask,
  };
};
export const setLoading = (loading) => {
  return {
    type: SET_LOADING,
    payload: loading,
  };
};

export const setError = (error) => {
  return {
    type: SET_ERROR,
    payload: error,
  };
};
