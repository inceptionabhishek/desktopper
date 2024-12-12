const initialState = {
  userData: null,
  userToken: null,
  userExpiry: null,
  loading: false,
  error: null,
};

const localStorageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_DATA":
      return {
        ...state,
        userData: action.payload,
      };
    case "SET_USER_TOKEN":
      return {
        ...state,
        userToken: action.payload,
      };
    case "SET_USER_EXPIRY":
      return {
        ...state,
        userExpiry: action.payload,
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

export default localStorageReducer;
