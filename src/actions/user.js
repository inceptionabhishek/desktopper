// Action Types
export const SET_USER = "SET_USER";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const LOGIN_USER = "LOGIN_USER";

// Action Creators
export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
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
