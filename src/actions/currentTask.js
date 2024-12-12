export const SET_CURRENT_TASK = "SET_CURRENT_TASK";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";

export const setCurrentTask = (currentTask) => {
  return {
    type: SET_CURRENT_TASK,
    payload: currentTask,
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
