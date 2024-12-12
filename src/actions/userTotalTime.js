export const FETCH_USER_TOTAL_TIME_SUCCESS = "FETCH_USER_TOTAL_TIME_SUCCESS";
export const FETCH_USER_TOTAL_TIME_FAILURE = "FETCH_USER_TOTAL_TIME_FAILURE";
export const FETCH_USER_TOTAL_TIME_START = "FETCH_USER_TOTAL_TIME_START";

export const setUserTotalTime = (totalTime) => ({
  type: FETCH_USER_TOTAL_TIME_SUCCESS,
  payload: totalTime,
});
