const initialState = {
  timerRunning: false,
  timeElapsed: 0,
  currentTimer: null,
  session: [],
  sessionOn: false,
  loading: false,
  error: null,
  startTime: null,
  endTime: null,
  idleTime: 0,
  startTimeInDigits: null,
  endTimeInDigits: null,
};
const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SESSION":
      return {
        ...state,
        session: [...state.session, action.payload],
      };
    case "SET_TIMER_RUNNING":
      return {
        ...state,
        timerRunning: action.payload,
      };
    case "SET_TIME_ELAPSED":
      return {
        ...state,
        timeElapsed: action.payload,
      };
    case "SET_CURRENT_TIMER":
      return {
        ...state,
        currentTimer: action.payload,
      };

    case "SET_SESSION_ON":
      return {
        ...state,
        sessionOn: action.payload,
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
    case "SET_START_TIME":
      return {
        ...state,
        startTime: action.payload,
      };
    case "SET_END_TIME":
      return {
        ...state,
        endTime: action.payload,
      };
    case "SET_IDLE_TIME":
      return {
        ...state,
        idleTime: action.payload,
      };
    case "SET_RESET_SESSION":
      return {
        ...state,
        idleTime: 0,
        session: [],
      };
    case "SET_START_TIME_IN_DIGITS":
      return {
        ...state,
        startTimeInDigits: action.payload,
      };
    case "SET_END_TIME_IN_DIGITS":
      return {
        ...state,
        endTimeInDigits: action.payload,
      };

    default:
      return state;
  }
};

export default sessionReducer;
