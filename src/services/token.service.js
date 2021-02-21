const TOKEN_NAME = 'token'

const getToken = () => {
  return localStorage.getItem(TOKEN_NAME)
}

const setToken = (token) => {
  localStorage.setItem(TOKEN_NAME, token)
}

const removeToken = () => {
  localStorage.removeItem(TOKEN_NAME)
}

export default { getToken, setToken, removeToken }
