const initialState = {
  selectedTask: null,
  loading: false,
  error: null,
};

const selectedTaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SELECTED_TASK":
      return {
        ...state,
        selectedTask: action.payload,
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

export default selectedTaskReducer;
