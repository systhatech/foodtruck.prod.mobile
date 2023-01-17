const ID_TOKEN_KEY = "id_token";
const ID_DESTINATION = "destination";
const ID_UTYPE = "utype";
// import ApiService from "../services"
// import JwtService from "./jwt.service";
export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};
export const getUtype = () => {
  return window.localStorage.getItem(ID_UTYPE);
};

export const saveUtype = token => {
  window.localStorage.setItem(ID_UTYPE, token);
};
export const saveToken = token => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
  window.localStorage.removeItem('utype');
};

export const getDestination = () => {
  return window.localStorage.getItem(ID_DESTINATION);
};

export const saveDestination = destination => {
  window.localStorage.setItem(ID_DESTINATION, destination);
};

export const destroyDestination = () => {
  window.localStorage.removeItem(ID_DESTINATION);
};

// export const setHeader = () => {
//   ApiService.defaults.headers.common["Authorization"] = `Token ${JwtService.getToken()}`;
// };
export default { getToken, saveToken, destroyToken, getUtype, saveUtype };
