import jwt_decode from "jwt-decode";

export function getValidToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  if (isTokenExpired(token)) {
    return null;
  }

  return token;
}

export function isTokenExpired(token) {
  try {
    const decoded = jwt_decode(token);
    if (!decoded.exp) return true;

    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (error) {
    return true;
  }
}

