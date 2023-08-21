// apiHandler.js

// Function to check if the network is available
function isOnline() {
  return navigator.onLine;
}

// Function to handle GET requests
function get(url) {
  return new Promise((resolve, reject) => {
    if (!isOnline()) {
      reject(new Error("No network connection."));
      return;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => {
        console.error("GET Error:", error);
        reject(error);
      });
  });
}

// Function to handle POST requests
function post(url, data) {
  return new Promise((resolve, reject) => {
    if (!isOnline()) {
      reject(new Error("No network connection."));
      return;
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => resolve(responseData))
      .catch((error) => {
        console.error("POST Error:", error);
        reject(error);
      });
  });
}

// Function to handle PUT requests
function put(url, data) {
  return new Promise((resolve, reject) => {
    if (!isOnline()) {
      reject(new Error("No network connection."));
      return;
    }

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => resolve(responseData))
      .catch((error) => {
        console.error("PUT Error:", error);
        reject(error);
      });
  });
}

// Function to handle DELETE requests
function del(url) {
  return new Promise((resolve, reject) => {
    if (!isOnline()) {
      reject(new Error("No network connection."));
      return;
    }

    fetch(url, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 200) { //it should send 204 but api is returning 200
          resolve("Resource deleted successfully");
        } else {
          return response.json();
        }
      })
      .then((responseData) => resolve(responseData))
      .catch((error) => {
        console.error("DELETE Error:", error);
        reject(error);
      });
  });
}

// Attach functions to the global window object
window.apiHandler = {
  get,
  post,
  put,
  del,
};
