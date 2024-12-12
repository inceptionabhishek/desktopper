export const SET_PROJECT_TIME_TRACKED = "SET_PROJECT_TIME_TRACKED";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const setProjectTimeTracked = (Data) => {
  return {
    type: SET_PROJECT_TIME_TRACKED,
    payload: {
      projectId: Data.Data.projectId,
      timeTracked: Data.Data.totalTimeTracked,
    },
  };
};

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});
export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});
