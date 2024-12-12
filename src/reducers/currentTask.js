const initialState = {
  currentTask: null,
  loading: false,
  error: null,
};

const currentTaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CURRENT_TASK":
      return {
        ...state,
        currentTask: action.payload,
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

export default currentTaskReducer;
