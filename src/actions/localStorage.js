export const SET_USER_DATA = "SET_USER_DATA";
export const SET_USER_TOKEN = "SET_USER_TOKEN";
export const SET_USER_EXPIRY = "SET_USER_EXPIRY";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";

export const setUserData = (data) => ({
  type: SET_USER_DATA,
  payload: data,
});

export const setUserToken = (data) => ({
  type: SET_USER_TOKEN,
  payload: data,
});

export const setUserExpiry = (data) => ({
  type: SET_USER_EXPIRY,
  payload: data,
});

export const setLoading = (data) => ({
  type: SET_LOADING,
  payload: data,
});

export const setError = (data) => ({
  type: SET_ERROR,
  payload: data,
});
