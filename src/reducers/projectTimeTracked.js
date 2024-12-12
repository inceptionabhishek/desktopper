const initialState = {
  timeTracked: {},
  loading: false,
  error: null,
};

const projectTimeTrackedReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PROJECT_TIME_TRACKED":
      return {
        ...state,
        timeTracked: {
          ...state.timeTracked,
          [action.payload.projectId]: action.payload.timeTracked,
        },
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

export default projectTimeTrackedReducer;
