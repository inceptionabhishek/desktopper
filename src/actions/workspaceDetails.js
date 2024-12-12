export const SET_WORKSPACE_DETAILS = "SET_WORKSPACE_DETAILS";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";

export const setWorkspaceDetails = (workspaceDetails) => {
  return {
    type: SET_WORKSPACE_DETAILS,
    payload: workspaceDetails,
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
