const initialState = {
  lastUpdated: null,
  loading: false,
  error: null,
};

const lastUpdatedStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LAST_UPDATED":
      return {
        ...state,
        lastUpdated: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default lastUpdatedStatusReducer;
