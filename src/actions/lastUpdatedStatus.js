export const SET_LAST_UPDATED = "SET_LAST_UPDATED";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";

export const setLastUpdated = (lastUpdated) => {
  return {
    type: SET_LAST_UPDATED,
    payload: lastUpdated,
  };
};
export const setLoading = (loading) => {
  return {
    type: SET_LOADING,
    payload: loading,
  };
};
