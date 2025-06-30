import axios from "axios";
// import Cookies from "js-cookie";



// const API_URL = process.env.API_URL;

const API_URL = "http://localhost:3000"; 


export const register = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/api/users/register`,
 { name, email, password })
  .then(function (response) {
    console.log(response);
    if ( response.data.data.token) {
    localStorage.setItem("token",  response.data.data.token);
  }
  return response.data;
  })
  .catch(function (error) {
    console.log(error);
  });
  
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/api/users/login`,
     { email, password })
    .then(function (response) {
  if ( response.data.data.token) {
    localStorage.setItem("token", response.data.data.token);
  }
  return response;
  })
  .catch(function (error) {
    console.log(error);
  });
  
};



export const logout = () => {
//   Cookies.remove("token");
  localStorage.removeItem("token");
};

// export const getToken = () => Cookies.get("token");

