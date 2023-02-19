//export const url = "https://####.com/api"; // this is for my app connection when hosted
export const url = "http://localhost:5000/api"; // for my localhost backend connection


// getting the headers for authentication.
export const setHeaders = () => {
  const headers = {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  };

  return headers;
};
