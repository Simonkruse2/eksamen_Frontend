const URL = "http://localhost:8080/eksamen";

function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

function apiFacade() {
  const setToken = token => {
    localStorage.setItem("jwtToken", token);
  };
  const getToken = () => {
    return localStorage.getItem("jwtToken");
  };
  const getRole = () => {
    let jwt = localStorage.getItem("jwtToken");
    let jwtData = jwt.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    return decodedJwtData.roles;
  };

  const getUser = () => {
    let jwt = localStorage.getItem("jwtToken");
    let jwtData = jwt.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    return decodedJwtData;
  };
  const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
  };
  const logout = () => {
    localStorage.removeItem("jwtToken");
  };

  const login = (user, password) => {
    const options = makeOptions("POST", true, {
      username: user,
      password: password
    });
    return fetch(URL + "/api/login", options)
      .then(handleHttpErrors)
      .then(res => {
        setToken(res.token);
      });
  };

  const fetchData = () => {
    const options = makeOptions("GET", true); //True add's the token
    if (getRole() === "admin") {
      return fetch(URL + "/api/info/admin", options).then(handleHttpErrors);
    }
    return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
  };

  const fetchCreateWeekPlan = (weekPlan) => {
      const options = makeOptions("POST", true, weekPlan);
      return fetch(URL + "/api/food/createWeekPlan/", options).then(
        handleHttpErrors
      );
      }
  const fetchAllWeekPlans = () => {
    const options = makeOptions("GET", true); //True add's the token
    return fetch(URL + "/api/food/allWeekPlans", options).then(
      handleHttpErrors
    );
  };

  const fetchRecipeById = id => {
    const options = makeOptions("GET", true);
    return fetch(URL + "/api/food/find/" + id, options).then(handleHttpErrors);
  };

  const fetchAllRecipes = () => {
    const options = makeOptions("GET", true); //True add's the token
    return fetch(URL + "/api/food/all", options).then(handleHttpErrors);
  };

  const fetchCreateEditRecipe = (recipeDTO, id) => {
    if (recipeDTO.id === 0) {
      const options = makeOptions("POST", true, recipeDTO);
      return fetch(URL + "/api/food/createRecipe/", options).then(
        handleHttpErrors
      );
    }
    const options = makeOptions("PUT", true, recipeDTO);
    return fetch(URL + "/api/food/editRecipe/" + id, options).then(
      handleHttpErrors
    );
  };

  const makeOptions = (method, addToken, body) => {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    };
    if (addToken && loggedIn()) {
      opts.headers["x-access-token"] = getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  };
  return {
    makeOptions,
    setToken,
    getToken,
    loggedIn,
    login,
    logout,
    fetchData,
    getRole,
    fetchCreateWeekPlan,
    fetchAllWeekPlans,
    getUser,
    fetchAllRecipes,
    fetchCreateEditRecipe,
    fetchRecipeById
  };
}
const facade = apiFacade();
export default facade;
