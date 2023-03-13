const express = require("express");
const mysql = require("mysql");
var cors = require("cors");

const routes = require("./routes");
const config = require("./config.json");

const app = express();

app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));

// Route 1
app.get("/restaurants", routes.all_restaurants);

// Route 2
app.get("/restaurant", routes.restaurant);

// Route 3
app.get("/search/restaurants", routes.search_restaurants);

// Route 4
app.get("/recipes", routes.many_recipes);

// Route 5
app.get("/recipe", routes.recipe);

// Route 6
app.get("/search/recipes", routes.search_recipes);

// Route 7
app.get("/menuitem", routes.menu_item);

// Route 8
app.get("/mypage/myrecipe", routes.my_recipe);

// Route 9
app.get("/mypage/myrestaurant", routes.my_restaurant);

// Route 10
app.get("/mypage/myfavorite", routes.my_favorite);

// Route 11
app.get("/restaurantsnearby", routes.restaurants_nearby);

// Route 12
app.get("/popularcategories", routes.popular_categories);

// Route 13
app.get("/mypage/myrestaurantsrecipes", routes.my_restaurants_recipes);

//Route 14
app.get("/validatelogin", routes.login_info);

//Route 15
app.get("/register", routes.registration_info);

//Route 16
app.get("/addrestaurants", routes.add_user_restaurants);

//Route 17
app.get("/addrecipes", routes.add_user_recipes);

//Route 18
app.get("/mypage/deleterestaurants", routes.delete_user_restaurants);

//Route 19
app.get("/mypage/deleterecipes", routes.delete_user_recipes);

app.listen(config.server_port, () => {
  console.log(
    `Server running at http://${config.server_host}:${config.server_port}/`
  );
});

module.exports = app;
