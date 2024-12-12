const initialState = {
  currentProject: null,
  loading: false,
  error: null,
};

const currentProjectReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CURRENT_PROJECT":
      return {
        ...state,
        currentProject: action.payload,
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

export default currentProjectReducer;
