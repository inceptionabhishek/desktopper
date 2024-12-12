export const SET_SESSION = "SET_SESSION";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const SET_SESSION_ON = "SET_SESSION_ON";
export const SET_TIMER_RUNNING = "SET_TIMER_RUNNING";
export const SET_TIME_ELAPSED = "SET_TIME_ELAPSED";
export const SET_CURRENT_TIMER = "SET_CURRENT_TIMER";
export const SET_START_TIME = "SET_START_TIME";
export const SET_END_TIME = "SET_END_TIME";
export const SET_IDLE_TIME = "SET_IDLE_TIME";
export const SET_RESET_SESSION = "SET_RESET_SESSION";
export const SET_START_TIME_IN_DIGITS = "SET_START_TIME_IN_DIGITS";
export const SET_END_TIME_IN_DIGITS = "SET_END_TIME_IN_DIGITS";

export const setSession = (session) => {
  return {
    type: SET_SESSION,
    payload: session,
  };
};
export const setTimerRunning = (timerRunning) => {
  return {
    type: SET_TIMER_RUNNING,
    payload: timerRunning,
  };
};
export const setTimeElapsed = (timeElapsed) => {
  return {
    type: SET_TIME_ELAPSED,
    payload: timeElapsed,
  };
};
export const setCurrentTimer = (currentTimer) => {
  return {
    type: SET_CURRENT_TIMER,
    payload: currentTimer,
  };
};

export const setSessionOn = (sessionOn) => {
  return {
    type: SET_SESSION_ON,
    payload: sessionOn,
  };
};
export const setLoading = (loading) => {
  return {
    type: SET_LOADING,
    payload: loading,
  };
};

export const setError = (error) => {
  return {
    type: SET_ERROR,
    payload: error,
  };
};

export const setStartTime = (startTime) => {
  return {
    type: SET_START_TIME,
    payload: startTime,
  };
};
export const setEndTime = (endTime) => {
  return {
    type: SET_END_TIME,
    payload: endTime,
  };
};
export const setIdleTime = (idleTime) => {
  return {
    type: SET_IDLE_TIME,
    payload: idleTime,
  };
};

export const setResetSession = () => {
  return {
    type: SET_RESET_SESSION,
  };
};

export const setStartTimeInDigits = (startTimeInDigits) => {
  return {
    type: SET_START_TIME_IN_DIGITS,
    payload: startTimeInDigits,
  };
};
export const setEndTimeInDigits = (endTimeInDigits) => {
  return {
    type: SET_END_TIME_IN_DIGITS,
    payload: endTimeInDigits,
  };
};
