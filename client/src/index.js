import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import RegistrationPage from "./pages/RegistrationPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import RecipesPage from "./pages/RecipesPage";
import RecipePage from "./pages/RecipePage";
import RestaurantPage from "./pages/RestaurantPage";
import MenuItemPage from "./pages/MenuItemPage";
import "antd/dist/antd.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact path="/" render={() => <HomePage />} />
        <Route exact path="/login" render={() => <LoginPage />} />
        <Route exact path="/mypage" render={() => <MyPage />} />
        <Route exact path="/register" render={() => <RegistrationPage />} />
        <Route exact path="/restaurants" render={() => <RestaurantsPage />} />
        <Route exact path="/restaurant" render={() => <RestaurantPage />} />
        <Route exact path="/recipes" render={() => <RecipesPage />} />
        <Route exact path="/recipe" render={() => <RecipePage />} />
        <Route exact path="/menuitem" render={() => <MenuItemPage />} />
      </Switch>
    </Router>
  </div>,
  document.getElementById("root")
);
