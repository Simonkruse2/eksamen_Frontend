import "./App.css";
import React, { useState, useEffect } from "react";
import uuid from "uuid/v1";
import facade from "./apiFacade";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Switch,
  Route,
  NavLink,
  useHistory
} from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  let history = useHistory();

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
    history.push("/");
  };
  const login = (user, pass) => {
    facade.login(user, pass).then(res => setLoggedIn(true));
    history.push("/");
  };

  return (
    <div>
      {!loggedIn ? (
        <div>
          <HeaderStart />
          <ContentStart login={login} />
        </div>
      ) : (
        <div>
          <LoggedIn logout={logout} />
        </div>
      )}
    </div>
  );
}

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = evt => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  };
  const onChange = evt => {
    setLoginCredentials({
      ...loginCredentials,
      [evt.target.id]: evt.target.value
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onChange={onChange}>
        <input placeholder="User Name" id="username" />
        <input placeholder="Password" id="password" type="password" />
        <button onClick={performLogin}>Login</button>
      </form>
    </div>
  );
}
const Logout = ({ logout }) => {
  const handleLogout = () => {
    logout();
  };
  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

function LoggedIn({ logout }) {
  return (
    <div>
      <Header />
      <Content logout={logout} />
    </div>
  );
}
const HeaderStart = () => {
  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/login">
          Login
        </NavLink>
      </li>
    </ul>
  );
};
const ContentStart = ({ login }) => {
  return (
    <div style={{ paddingLeft: 15 }}>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <LogIn login={login} />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </div>
  );
};
const Header = () => {
  if (facade.getRole() === "admin") {
    return (
      <ul className="header">
        <li>
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/recipes">
            Recipes
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/weekplans">
            Weekplans
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/edit">
            Edit
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/logout">
            Logout
          </NavLink>
        </li>
        <li style={{ float: "right" }}>
          <NavLink activeClassName="active" to="/user-info">
            Hi {facade.getUser().username}! Role: {facade.getUser().roles}
          </NavLink>
        </li>
      </ul>
    );
  }
  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/weekplans">
          Weekplans
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/recipes">
          Recipes
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/logout">
          Logout
        </NavLink>
      </li>
    </ul>
  );
};

const Content = ({ logout }) => {
  return (
    <div style={{ paddingLeft: 15 }}>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/recipes">
          <Recipes />
        </Route>
        <Route path="/edit">
          <Edit />
        </Route>
        <Route path="/weekplans">
          <WeekPlans />
        </Route>
        <Route path="/logout">
          <Logout logout={logout} />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </div>
  );
};

const Home = () => {
  return (
    <div>
      <h3>Welcome to home</h3>
    </div>
  );
};

const WeekPlans = () => {
  const [listWeekPlans, setListWeekPlans] = useState([]);
  const [listRecipe, setListRecipe] = useState([0]);
  const [id, setId] = useState([0]);

  const handleChangeId = event => {
    const target = event.target;
    const value = target.value;
    const name = value.name;
    setId(Number(value));
    console.log("ID " + id);
  };

  useEffect(() => {
    let didCancel = false;
    facade.fetchRecipeById(id).then(res => {
      if (didCancel === false) {
        setListRecipe(res);
        console.log("Fetching Recipe complete", res);
      }
    });
    return () => {
      didCancel = true;
    };
  }, [id]);

  useEffect(() => {
    let didCancel = false;
    facade.fetchAllWeekPlans().then(res => {
      if (didCancel === false) {
        setListWeekPlans(res);
        console.log("Fetching WeekPlans complete", res);
      }
    });
    return () => {
      didCancel = true;
    };
  }, []);
  return (
    <div style={{ paddingLeft: 20 }}>
      <h3>Weekplans</h3>
      {console.log(listWeekPlans)}
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Week no.</th>
            <th>Year</th>
            <th>Recipe ID</th>
          </tr>
        </thead>
        <tbody>
          {listWeekPlans.map(weekplans => {
            return (
              <tr key={uuid}>
                <td>{weekplans.weekPlanId}</td>
                <td>{weekplans.weekNo}</td>
                <td>{weekplans.year}</td>
                <td>
                  {weekplans.recipes.map(recipe => {
                    return (
                      <div>
                        <button onClick={handleChangeId} value={recipe.id}>
                          Click me for more info
                        </button>
                      </div>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Recipes = () => {
  const [listRecipes, setListRecipes] = useState([]);

  // Jeg fik ikke det nedenstående til at virke
  const [weekPlan, setWeekPlan] = useState([]);
  const emptyRecipe = { id: "", name: "", preptime: "", directions: "" };
  const emptyIngredient = { amount: "", id: "" };
  const emptyItemDTO = { id: "", name: "", price: "", qty: "" };

  const [recipe, setRecipe] = useState(emptyRecipe);
  const [ingredient, setIngredient] = useState(emptyIngredient);
  const [itemDTO, setItemDTO] = useState(emptyItemDTO);
  const handleChangeAddToWeekPlan = event => {
    event.preventDefault();
    console.log("event.target.value" + event.target.value);
    facade.fetchRecipeById(event.target.value).then(res => {
      setRecipe({
        id: res.id,
        name: res.name,
        preptime: res.preptime,
        directions: res.directions
      });
      setIngredient({
        amount: res.ingredients[0].amount,
        id: res.ingredients[0].id
      });
      setItemDTO({
        id: res.ingredients[0].itemDTO.id,
        name: res.ingredients[0].itemDTO.name,
        price: res.ingredients[0].itemDTO.price,
        qty: res.ingredients[0].itemDTO.qty
      });
    });
    setWeekPlan(recipe, ingredient, itemDTO);
  };
  const handleChangeCreateWeekPlan = event => {
    event.preventDefault();
    console.log("WEEKPLAN" + weekPlan);
    facade.fetchCreateWeekPlan(weekPlan);
  };
  // Her til

  useEffect(() => {
    let didCancel = false;
    facade.fetchAllRecipes().then(res => {
      if (didCancel === false) {
        setListRecipes(res);
        console.log("Fetching Recipes complete", res);
      }
    });
    return () => {
      didCancel = true;
    };
  }, []);
  return (
    <div style={{ paddingLeft: 20 }}>
      <h3>Delicious Recipes</h3>
      {console.log(listRecipes)}
      <table className="table">
        <thead>
          <tr>
            <th>Add to weekplan</th>
            <th>Id</th>
            <th>Name</th>
            <th>Directions</th>
            <th>Preptime</th>
            <th>Ingredients</th>
          </tr>
        </thead>
        <tbody>
          {listRecipes.map(recipe => {
            return (
              <tr key={uuid}>
                <button onClick={handleChangeAddToWeekPlan} value={recipe.id}>
                  Click me
                </button>
                <td>{recipe.id}</td>
                <td>{recipe.name}</td>
                <td>{recipe.directions}</td>
                <td>Approx. {recipe.preptime} Min.</td>
                <td>
                  {recipe.ingredients.map(ingredients => {
                    return (
                      ingredients.amount +
                      " gram " +
                      ingredients.itemDTO.name +
                      ", "
                    );
                  })}
                </td>
              </tr>
            );
          })}
          <button onClick={handleChangeCreateWeekPlan}>Save weekplan</button>
        </tbody>
      </table>
    </div>
  );
};

const Edit = () => {
  const emptyRecipe = { id: "", name: "", preptime: "", directions: "" };
  const emptyIngredient = { amount: "", id: "" };
  const emptyItemDTO = { id: "", name: "", price: "", qty: "" };
  const [id, setId] = useState(0);

  const [recipe, setRecipe] = useState(emptyRecipe);
  const [ingredient, setIngredient] = useState(emptyIngredient);
  const [itemDTO, setItemDTO] = useState(emptyItemDTO);

  const handleChangeRecipe = event => {
    const target = event.target;
    const value = target.value;
    const name = target.id;
    setRecipe({ ...recipe, [name]: value });
  };
  const handleChangeIngredient = event => {
    const target = event.target;
    const value = target.value;
    const name = target.id;
    setIngredient({ ...ingredient, [name]: value });
  };
  const handleChangeItemDTO = event => {
    const target = event.target;
    const value = target.value;
    const name = target.id;
    setItemDTO({ ...itemDTO, [name]: value });
  };

  const handleChangeId = event => {
    const target = event.target;
    const value = target.value;
    setId(Number(value));
    console.log(id);
  };

  const handleSubmitFind = event => {
    event.preventDefault();
    facade.fetchRecipeById(id).then(res => {
      setRecipe({
        id: res.id,
        name: res.name,
        preptime: res.preptime,
        directions: res.directions
      });
      setIngredient({
        amount: res.ingredients[0].amount,
        id: res.ingredients[0].id
      });

      setItemDTO({
        id: res.ingredients[0].itemDTO.id,
        name: res.ingredients[0].itemDTO.name,
        price: res.ingredients[0].itemDTO.price,
        qty: res.ingredients[0].itemDTO.qty
      });

      console.log(res);
    });
  };
  const handleSubmit = event => {
    event.preventDefault();
    setRecipe({ ...emptyRecipe });
    setIngredient({ ...emptyIngredient });
    setItemDTO({ ...emptyItemDTO });

    const finalRecipe = {
      id: recipe.id,
      name: recipe.name,
      preptime: recipe.preptime,
      directions: recipe.directions,
      ingredients: [
        {
          amount: ingredient.amount,
          id: 0,
          itemDTO: {
            id: 0,
            name: itemDTO.name,
            price: itemDTO.price,
            qty: itemDTO.qty
          }
        }
      ]
    };
    facade.fetchCreateEditRecipe(finalRecipe);
    console.log(finalRecipe);
  };

  const submitTitle = recipe.id === null ? "Submit" : "Save";

  return (
    <div style={{ paddingLeft: 20 }}>
      <h3>Find and Edit</h3>

      <input onChange={handleChangeId} placeholder="Find Recipe by Id"></input>
      <button onClick={handleSubmitFind}>Find Recipe</button>

      <br />
      <input
        id="name"
        value={recipe.name}
        onChange={handleChangeRecipe}
        placeholder="Add the recipes name"
      ></input>
      <br />
      <input
        id="preptime"
        value={recipe.preptime}
        onChange={handleChangeRecipe}
        placeholder="Add approx preptime"
      ></input>
      <br />
      <input
        id="directions"
        value={recipe.directions}
        onChange={handleChangeRecipe}
        placeholder="Add helpful directions"
      ></input>
      <br />
      <input
        id="amount"
        value={ingredient.amount}
        onChange={handleChangeIngredient}
        placeholder="Add an amount"
      ></input>
      <br />
      <input
        id="id"
        value={ingredient.id}
        onChange={handleChangeIngredient}
        placeholder="Edit the ingredient ID"
      ></input>
      <br />
      <input
        id="id"
        value={itemDTO.id}
        onChange={handleChangeItemDTO}
        placeholder="Edit the item ID"
      ></input>
      <br />
      <input
        id="name"
        value={itemDTO.name}
        onChange={handleChangeItemDTO}
        placeholder="Type the ingredients name "
      ></input>
      <br />
      <input
        id="price"
        value={itemDTO.price}
        onChange={handleChangeItemDTO}
        placeholder="Add a fitting price"
      ></input>
      <br />
      <input
        id="qty"
        value={itemDTO.qty}
        onChange={handleChangeItemDTO}
        placeholder="Add a quantity"
      ></input>
      <br />
      <button onClick={handleSubmit}>{submitTitle}</button>
    </div>
  );
};

const NoMatch = () => <div>Urlen matcher ingen kendte routes</div>;
export default App;
