import config from "./config.json";

const getAllRestaurants = async (city) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/restaurants?city=${city}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getManyRecipes = async () => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/recipes`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getLoginInfo = async (email, password) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/validatelogin?email=${email}&password=${password}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getMyRestaurants = async (id) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/mypage/myrestaurant?id=${id}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getMyRecipes = async (id) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/mypage/myrecipe?id=${id}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getMyFavorites = async (id) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/mypage/myfavorite?id=${id}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getNearByRestaurants = async (id) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/restaurantsnearby?id=${id}`,
    {
      method: "GET",
    }
  );

  return res.json();
};

const getPopularCategories = async () => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/popularcategories`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const doRegistration = async (email, name, state, zipcode, password) => {
  var url = `http://${config.server_host}:${config.server_port}/register?email=${email}&password=${password}`;
  url = name ? url + `&name=${name}` : url;
  url = state ? url + `&state=${state}` : url;
  url = zipcode ? url + `&zipcode=${zipcode}` : url;
  var res = await fetch(url, {
    method: "GET",
  });
  return res.json();
};

const addMyRestaurants = async (user_id, restaurant_ids) => {
  var url = `http://${config.server_host}:${config.server_port}/addrestaurants?user_id=${user_id}`;
  for (let i = 0; i < restaurant_ids.length; i++) {
    url += "&restaurant_id=" + restaurant_ids[i];
  }
  var res = await fetch(url, {
    method: "GET",
  });
  return res.json();
};

const addMyRecipes = async (user_id, recipe_ids) => {
  var url = `http://${config.server_host}:${config.server_port}/addrecipes?user_id=${user_id}`;
  for (let i = 0; i < recipe_ids.length; i++) {
    url += "&recipe_id=" + recipe_ids[i];
  }
  var res = await fetch(url, {
    method: "GET",
  });
  return res.json();
};

const getMyRestaurantsRecipes = async (id) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/mypage/myrestaurantsrecipes?id=${id}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const deleteMyRestaurants = async (user_id, restaurant_ids) => {
  var url = `http://${config.server_host}:${config.server_port}/mypage/deleterestaurants?user_id=${user_id}`;
  for (let i = 0; i < restaurant_ids.length; i++) {
    url += "&restaurant_id=" + restaurant_ids[i];
  }
  var res = await fetch(url, {
    method: "GET",
  });
  return res.json();
};
const getRecipe = async (id) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/recipe?id=${id}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const searchRecipe = async (name) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/search/recipes?name=${name}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const deleteMyRecipes = async (user_id, recipe_ids) => {
  var url = `http://${config.server_host}:${config.server_port}/mypage/deleterecipes?user_id=${user_id}`;
  for (let i = 0; i < recipe_ids.length; i++) {
    url += "&recipe_id=" + recipe_ids[i];
  }
  var res = await fetch(url, {
    method: "GET",
  });
  return res.json();
};

const getRestaurantSearch = async (name, location, cuisine, phone) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/search/restaurants?name=${name}&location=${location}&cuisine=${cuisine}&phone=${phone}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getRestaurant = async (id) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/restaurant?id=${id}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

const getMenuItem = async (id) => {
  var res = await fetch(
    `http://${config.server_host}:${config.server_port}/menuitem?id=${id}`,
    {
      method: "GET",
    }
  );
  return res.json();
};

export {
  getAllRestaurants,
  getManyRecipes,
  getLoginInfo,
  getMyRestaurants,
  getMyRecipes,
  getMyFavorites,
  getNearByRestaurants,
  getPopularCategories,
  doRegistration,
  addMyRestaurants,
  addMyRecipes,
  getMyRestaurantsRecipes,
  deleteMyRecipes,
  deleteMyRestaurants,
  getRestaurantSearch,
  getRestaurant,
  getRecipe,
  searchRecipe,
  getMenuItem,
};
