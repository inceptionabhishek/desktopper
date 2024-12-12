const initialState = {
  totalTodayTime: 0,
  loading: false,
  error: null,
};

const userTotalTimeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_USER_TOTAL_TIME_START":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_USER_TOTAL_TIME_SUCCESS":
      return {
        ...state,
        totalTodayTime: action.payload,
        loading: false,
      };
    case "FETCH_USER_TOTAL_TIME_FAIL":
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
};

export default userTotalTimeReducer;
