export const SET_TASKS = "SET_TASKS";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";

export const setTasks = (tasks) => {
  return {
    type: SET_TASKS,
    payload: tasks,
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
