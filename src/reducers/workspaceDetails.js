const initialState = {
  workspaceDetails: null,
  loading: false,
  error: null,
};

const workspaceDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_WORKSPACE_DETAILS":
      return {
        ...state,
        workspaceDetails: action.payload,
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

export default workspaceDetailsReducer;
