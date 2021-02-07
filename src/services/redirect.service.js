const ID_REDIRECT_PATH = "redirectPath";

const getRedirectPath = () => {
  return sessionStorage.getItem(ID_REDIRECT_PATH);
};

const setRedirectPath = value => {
  sessionStorage.setItem(ID_REDIRECT_PATH, value);
};

const removeRedirectPath = () => {
  sessionStorage.removeItem(ID_REDIRECT_PATH);
};

export default { getRedirectPath, setRedirectPath, removeRedirectPath };
