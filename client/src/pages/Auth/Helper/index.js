export const isLoggedIn = () => {
  if (localStorage.getItem("token") !== null) {
    return true;
  } else {
    return false;
  }
};

export const login = (creds) => {
  if (creds !== null || undefined) {
    localStorage.setItem("token", JSON.stringify(creds));
    return true;
  } else {
    return false;
  }
};

export const logout = () => {
  if (localStorage.getItem("token") !== null) {
    localStorage.removeItem("token");
  }
};
