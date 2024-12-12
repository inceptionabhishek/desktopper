export const SET_CURRENT_PROJECT = "SET_CURRENT_PROJECT";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";

export const setCurrentProject = (currentProject) => {
  return {
    type: SET_CURRENT_PROJECT,
    payload: currentProject,
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
